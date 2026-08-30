import { IsOptional, IsString, MaxLength } from 'class-validator';

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
}