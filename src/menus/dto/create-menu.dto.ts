import { IsString, IsNotEmpty, IsOptional, IsInt, Allow } from 'class-validator';

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

  @IsInt()
  @IsOptional()
  status?: number;

  // FIX: Allow null values for parent_id
  // Validation untuk memastikan UUID yang valid akan dilakukan di service layer
  @Allow()
  parent_id?: string | null;
}