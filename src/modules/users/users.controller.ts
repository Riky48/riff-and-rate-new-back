import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt')) // Protege todas las rutas de este controlador
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users/me -> Devuelve el perfil del usuario autenticado
  @Get('me')
  getProfile(@GetUser('id') userId: number) {
    return this.usersService.findProfile(userId);
  }

  // PATCH /users/me -> Actualiza la bio o ubicación del usuario
  @Patch('me')
  updateProfile(
    @GetUser('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(userId, updateUserDto);
  }
}