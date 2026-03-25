import { IsString, IsNotEmpty, IsOptional, IsInt, Allow, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MenuType } from '../enums/menu-type.enum';

/**
 * Data Transfer Object for creating a new Menu item
 * 
 * Required fields:
 * - title: Display title of the menu item
 * 
 * Optional fields:
 * - type: Type of menu (static, dynamic, or group)
 * - order: Display order in the menu hierarchy
 * - status: Active status of the menu
 * - parent_id: UUID of parent menu item for nested menus
 */
export class CreateMenuDto {
  @ApiProperty({
    example: 'About Us',
    description: 'Display title of the menu item',
    required: true,
    type: String,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty({ message: 'Menu title is required' })
  title: string;

  @ApiPropertyOptional({
    enum: MenuType,
    example: MenuType.STATIC,
    description: 'Type of menu item. STATIC = fixed page, DYNAMIC = dynamic content, GRUP = container for submenus.',
    required: false,
    enumName: 'MenuType',
    default: MenuType.STATIC
  })
  @IsEnum(MenuType)
  @IsOptional()
  type?: MenuType;

  @ApiPropertyOptional({
    example: 1,
    description: 'Display order of the menu item. Lower numbers appear first.',
    required: false,
    type: Number,
    default: 0
  })
  @IsInt()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Status of the menu item. 1 = active, 0 = inactive.',
    required: false,
    type: Number,
    default: 1
  })
  @IsInt()
  @IsOptional()
  status?: number;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of the parent menu item. Use to create nested/submenu items. Leave empty for top-level menus.',
    required: false,
    type: String,
    format: 'uuid',
    nullable: true
  })
  @Allow()
  parent_id?: string | null;
}
