import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { GetUser } from '../../common/decorators/get-user-decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Route protegida: Requiere Token JWT en la cabecera
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() createPostDto: CreatePostDto,
    @GetUser('id') userId: number, // Extrae automáticamente el ID del token verificado
  ) {
    return this.postsService.create(createPostDto, userId);
  }

  // Route pública: Cualquiera puede ver las publicaciones
  @Get()
  findAll() {
    return this.postsService.findAll();
  }
}