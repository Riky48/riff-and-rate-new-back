import { IsOptional, IsString, MaxLength, IsArray } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nombre?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  ubicacion?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  actividad?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  bandas?: string[];

  @IsOptional()
  @IsString()
  fotoPerfil?: string; // 

  @IsOptional()
  @IsString()
  banner?: string; // 
}
