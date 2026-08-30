import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Buscar perfil propio con sus publicaciones y productos en el Marketplace
  async findProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        posts: true,
        products: true,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        bio: true,
        ubicacion: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  // Actualizar datos del perfil
  async updateProfile(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: userId,
      ...updateUserDto,
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');
    return await this.userRepository.save(user);
  }
}