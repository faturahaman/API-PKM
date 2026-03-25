import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SanitizeText } from '../../common/decorators/sanitize.decorator';

/**
 * Data Transfer Object for creating a new Agenda activity
 * 
 * Required fields:
 * - activity_name: Name of the activity/event
 * - date: Date of the activity
 * - time: Time window of the activity
 * - location: Location/address of the activity
 * 
 * Optional fields:
 * - effective_date: Applicable starting from this date (for recurring events)
 */
export class CreateAgendaDto {
  @ApiProperty({
    example: 'Posyandu Lansia',
    description: 'Name/title of the activity or event. Max 255 characters.',
    required: true,
    type: String,
    maxLength: 255
  })
  @IsNotEmpty({ message: 'Nama aktivitas wajib diisi' })
  @IsString()
  @SanitizeText()
  activity_name: string;

  @ApiProperty({
    example: '2026-03-24',
    description: 'Date of the activity in YYYY-MM-DD format',
    required: true,
    type: String,
    format: 'date'
  })
  @IsNotEmpty({ message: 'Tanggal agenda wajib diisi' })
  @IsDateString({}, { message: 'Format tanggal salah (gunakan YYYY-MM-DD)' })
  date: string;

  @ApiProperty({
    example: '08:00 - 12:00',
    description: 'Time window of the activity (e.g., "09:00 - 12:00")',
    required: true,
    type: String,
    maxLength: 50
  })
  @IsNotEmpty({ message: 'Waktu wajib diisi' })
  @IsString()
  @SanitizeText()
  time: string;

  @ApiProperty({
    example: 'Balai Warga RW 05',
    description: 'Location or address where the activity will be held',
    required: true,
    type: String,
    maxLength: 255
  })
  @IsNotEmpty({ message: 'Lokasi wajib diisi' })
  @IsString()
  @SanitizeText()
  location: string;

  @ApiPropertyOptional({
    example: '2026-03-24',
    description: 'Effective date for recurring events. If set, the agenda is valid starting from this date. Leave empty for one-time events.',
    required: false,
    type: String,
    format: 'date'
  })
  @IsOptional()
  @IsString()
  @SanitizeText()
  effective_date?: string;
}
