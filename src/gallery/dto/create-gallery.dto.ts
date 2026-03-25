import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a new Gallery image
 * 
 * Required fields:
 * - image_title: Title of the image
 * 
 * Optional fields:
 * - description: Description of the image
 * - album_id: UUID of the album to assign the image to
 */
export class CreateGalleryDto {
  @ApiProperty({
    example: 'Puskesmas Opening Ceremony',
    description: 'Title of the gallery image',
    required: true,
    type: String,
    maxLength: 255
  })
  @IsNotEmpty({ message: 'Image title is required' })
  @IsString()
  image_title: string;

  @ApiPropertyOptional({
    example: 'Opening ceremony of the new building',
    description: 'Detailed description of the image content',
    required: false,
    type: String,
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of the album to assign this image to. If not provided, image will be unassigned.',
    required: false,
    type: String,
    format: 'uuid'
  })
  @IsOptional()
  @IsString()
  album_id?: string;
}
