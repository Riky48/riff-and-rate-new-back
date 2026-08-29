import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: 'El contenido de la publicación no puede estar vacío' })
  contenido!: string;

  @IsString()
  @IsOptional()
  imagenUrl?: string;
}