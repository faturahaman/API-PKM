import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateConsultationDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}