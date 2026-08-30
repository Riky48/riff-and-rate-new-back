// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const emailNormalized = registerDto.email.toLowerCase().trim();

    const existingUser = await this.userRepository.findOne({ 
      where: { email: emailNormalized } 
    });
    
    if (existingUser) {
      throw new BadRequestException('El email ya se encuentra registrado');
    }

    // Hasheado seguro con await obligatorio
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = this.userRepository.create({
      ...registerDto,
      email: emailNormalized,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);
    return this.generateToken(newUser);
  }

  async login(loginDto: LoginDto) {
    const emailNormalized = loginDto.email.toLowerCase().trim();

    // Traemos explícitamente el hash de la contraseña
    const user = await this.userRepository.findOne({
      where: { email: emailNormalized },
      select: {id: true,
                nombre: true,
                email: true,
                password: true, 
                rol: true
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas (usuario no existe)');
    }

    // Validación asíncrona del hash con bcrypt
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas (contraseña errónea)');
    }

    return this.generateToken(user);
  }

  private generateToken(user: User) {
    const payload = { sub: user.id, email: user.email, rol: user.rol };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    };
  }
}