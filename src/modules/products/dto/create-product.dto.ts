import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MaxLength(150)
  titulo!: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  descripcion!: string;

  @IsNumber({}, { message: 'El precio debe ser un número válido' })
  @IsPositive({ message: 'El precio debe ser mayor a cero' })
  precio!: number;

  @IsString()
  @IsNotEmpty()
  condicion!: string;

  @IsString()
  @IsNotEmpty()
  categoria!: string;

  @IsString()
  @IsOptional()
  imagenUrl?: string;
}