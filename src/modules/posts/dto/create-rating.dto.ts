import { IsInt, Max, Min } from 'class-validator';

export class CreateRatingDto {
  @IsInt({ message: 'La puntuación debe ser un número entero' })
  @Min(1, { message: 'La puntuación mínima es 1 estrella' })
  @Max(5, { message: 'La puntuación máxima es 5 estrellas' })
  puntuacion!: number;
}