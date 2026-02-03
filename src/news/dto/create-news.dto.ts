import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateNewsDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  day: string;

  @IsNotEmpty()
  @IsDateString() 
  date: string; // Ubah ke string dulu untuk validasi input

  @IsNotEmpty()
  @IsString()
  clock: string;

  @IsOptional()
  @IsString()
  image?: string;
}