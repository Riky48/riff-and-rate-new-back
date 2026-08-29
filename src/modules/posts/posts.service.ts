import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const newPost = this.postRepository.create({
      ...createPostDto,
      userId,
    });
    return await this.postRepository.save(newPost);
  }

  async findAll() {
    return await this.postRepository.find({
      relations: {user: true}, // Realiza el JOIN con la tabla de usuarios
      select: {
        user: {
          id: true,
          nombre: true,
          rol: true,
        }, // Filtra los campos sensibles para no exponer el password
      },
      order: {
        createdAt: 'DESC', // Muestra los más recientes primero
      },
    });
  }
}