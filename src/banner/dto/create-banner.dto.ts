import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a new Banner
 * 
 * Required fields:
 * - title: Title of the banner
 * 
 * Optional fields:
 * - image_path: URL path to the banner image (auto-populated from upload)
 * - description: Description text for the banner
 * - is_publish: Whether the banner is published/visible
 */
export class CreateBannerDto {
  @ApiPropertyOptional({
    example: '/uploads/banners/banner-1.jpg',
    description: 'URL path to the banner image. Auto-populated from file upload in controller.',
    required: false,
    type: String
  })
  @IsString()
  @IsOptional()
  image_path?: string;

  @ApiProperty({
    example: 'Welcome to Puskesmas',
    description: 'Title of the banner displayed to users',
    required: true,
    type: String,
    maxLength: 255
  })
  @IsNotEmpty({ message: 'Banner title is required' })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'Join us for health screening event',
    description: 'Description or call-to-action text for the banner',
    required: false,
    type: String,
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the banner is published and visible to users. Defaults to false (not published).',
    required: false,
    type: Boolean,
    default: false
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === '1' || value === 1) return true;
    if (value === 'false' || value === '0' || value === 0) return false;
    return value;
  })
  @IsBoolean()
  is_publish?: boolean;
}
