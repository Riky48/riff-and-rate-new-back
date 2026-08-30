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
  // 1. Buscamos los posts en MySQL incluyendo sus calificaciones individuales
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

  // 2. Recorremos cada post y calculamos su promedio de estrellas en el aire
  return posts.map(post => {
    const totalRatings = post.ratings?.length || 0;
    const sumaRatings = post.ratings?.reduce((sum, r) => sum + r.puntuacion, 0) || 0;
    
    // Si tiene calificaciones saca el promedio con 1 decimal (ej: 4.5), si no, queda en 0.
    const promedioRating = totalRatings > 0 
      ? Number((sumaRatings / totalRatings).toFixed(1)) 
      : 0;

    // 3. Devolvemos el post e inyectamos la propiedad "promedioRating" para el Frontend
    return {
      ...post,
      promedioRating, 
    };
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
      where: { userId, postId },
    });

    if (rating) {
      // Si ya existía voto, actualizamos el puntaje
      rating.puntuacion = createRatingDto.puntuacion;
    } else {
      // Si es la primera vez, creamos el voto
      rating = this.ratingRepository.create({
        userId,
       postId,
        puntuacion: createRatingDto.puntuacion,
      });
    }

    return await this.ratingRepository.save(rating);
  }
}