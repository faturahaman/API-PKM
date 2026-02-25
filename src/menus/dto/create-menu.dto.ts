import { IsString, IsNotEmpty, IsOptional, IsInt, Allow, IsEnum } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(['static', 'dynamic', 'custom'])
  @IsOptional()
  type?: 'static' | 'dynamic' | 'custom';

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