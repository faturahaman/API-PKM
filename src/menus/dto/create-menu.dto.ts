import { IsString, IsNotEmpty, IsOptional, IsInt, IsUUID } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  url_target: string;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsUUID()
  @IsOptional()
  parentId?: string;
}