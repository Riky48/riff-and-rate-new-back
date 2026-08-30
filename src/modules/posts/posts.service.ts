import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Rating } from './entities/rating.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>, // <-- Inyecto el repo de Rating
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
      relations: {
        user: true,
        ratings: true, // <-- Incluir los ratings de cada post
      },
      select: {
        user: {
          id: true,
          nombre: true,
          rol: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async ratePost(postId: number, userId: number, createRatingDto: CreateRatingDto) {
    // 1. Verificar que la publicación exista
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('La publicación no existe');
    }

    // 2. Buscar si el usuario ya votó esta publicación previamente
    let rating = await this.ratingRepository.findOne({
      where: { postId, userId },
    });

    if (rating) {
      // Si ya existía voto, actualizamos el puntaje
      rating.puntuacion = createRatingDto.puntuacion;
    } else {
      // Si es la primera vez, creamos el voto
      rating = this.ratingRepository.create({
        postId,
        userId,
        puntuacion: createRatingDto.puntuacion,
      });
    }

    return await this.ratingRepository.save(rating);
  }
}