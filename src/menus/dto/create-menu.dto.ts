import { IsString, IsNotEmpty, IsOptional, IsInt, Allow, IsEnum } from 'class-validator';
import { MenuType } from '../enums/menu-type.enum';
export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(MenuType)
  @IsOptional()
  type?: MenuType;

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