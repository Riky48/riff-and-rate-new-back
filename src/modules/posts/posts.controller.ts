import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from 
import { CreatePostDto } from './dto/create-post.dto';
import { CreateRatingDto } from './dto/create-rating.dto';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() createPostDto: CreatePostDto,
    @GetUser('id') userId: number,
  ) {
    return this.postsService.create(createPostDto, userId);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  // Ruta para calificar: POST /posts/1/rate
  @Post(':id/rate')
  @UseGuards(AuthGuard('jwt'))
  rate(
    @Param('id', ParseIntPipe) postId: number,
    @Body() createRatingDto: CreateRatingDto,
    @GetUser('id') userId: number,
  ) {
    return this.postsService.ratePost(postId, userId, createRatingDto);
  }
}