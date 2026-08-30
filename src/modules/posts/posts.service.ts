// src/modules/posts/posts.service.ts
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
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const newPost = this.postRepository.create({
      ...createPostDto,
      user: { id: userId },
    });
    return await this.postRepository.save(newPost);
  }

  async findAll() {
    const posts = await this.postRepository.find({
      relations: {
        user: true,
        ratings: true,
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

    // Mapeo dinámico para calcular el promedio de estrellas que consume el Frontend
    return posts.map((post) => {
      const totalRatings = post.ratings?.length || 0;
      const sumaPuntuaciones = post.ratings?.reduce((acc, r) => acc + Number(r.puntuacion), 0) || 0;
      const promedioRating = totalRatings > 0 ? Number((sumaPuntuaciones / totalRatings).toFixed(1)) : null;

      return {
        ...post,
        promedioRating,
      };
    });
  }

  async ratePost(postId: number, userId: number, createRatingDto: CreateRatingDto) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('La publicación no existe');
    }

    let rating = await this.ratingRepository.findOne({
      where: { postId, userId },
    });

    if (rating) {
      rating.puntuacion = createRatingDto.puntuacion;
    } else {
      rating = this.ratingRepository.create({
        postId,
        userId,
        puntuacion: createRatingDto.puntuacion,
      });
    }

    return await this.ratingRepository.save(rating);
  }
}