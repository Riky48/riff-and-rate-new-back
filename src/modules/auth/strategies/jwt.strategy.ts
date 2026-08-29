import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // Extrae el Token del encabezado 'Authorization: Bearer <token>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secreto_default',
    });
  }

  // Se ejecuta automáticamente si el token es válido
  async validate(payload: { sub: number; email: string; rol: string }) {
    if (!payload.sub) {
      throw new UnauthorizedException('Token no válido');
    }
    // Lo que retornemos acá se guarda en req.user
    return { id: payload.sub, email: payload.email, rol: payload.rol };
  }
}