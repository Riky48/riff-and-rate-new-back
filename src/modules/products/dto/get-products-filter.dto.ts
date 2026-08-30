import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetProductsFilterDto {
  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @Type(() => Number) // Convierte el string de la URL a número antes de validar
  @IsNumber({}, { message: 'El precio mínimo debe ser un número' })
  @Min(0)
  minPrecio?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El precio máximo debe ser un número' })
  @Min(0)
  maxPrecio?: number;

  @IsOptional()
  @IsString()
  buscar?: string; // Búsqueda por palabra clave en título o descripción
}