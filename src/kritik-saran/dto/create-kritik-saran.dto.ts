import { IsString, IsOptional, IsEmail, IsEnum, IsNumber, Min, Max, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Category enumeration for feedback
 */
export enum KritikSaranKategori {
    /** Criticism - negative feedback or complaint */
    KRITIK = 'kritik',
    /** Suggestion - improvement ideas */
    SARAN = 'saran',
}

/**
 * Status enumeration for feedback
 */
export enum KritikSaranStatus {
    /** New/unread feedback */
    BARU = 0,
    /** Feedback has been read */
    DIBACA = 1,
    /** Feedback has been processed */
    DIPROSES = 2,
}

/**
 * Data Transfer Object for creating a new Feedback (Kritik/Saran)
 * 
 * Required fields:
 * - nama: Name of the person submitting feedback
 * - no_hp: Phone number
 * - pesan: Feedback message content
 * 
 * Optional fields:
 * - email: Email address (optional)
 * - kategori: Type of feedback (kritik or saran)
 * 
 * @example
 * {
 *   nama: "John Doe",
 *   email: "john@example.com",
 *   no_hp: "081234567890",
 *   pesan: "Saya menyarankan perbaikan pada layanan obat",
 *   kategori: "saran"
 * }
 */
export class CreateKritikSaranDto {
    @ApiProperty({
        example: 'John Doe',
        description: 'Full name of the person submitting feedback',
        required: true,
        type: String,
        maxLength: 100
    })
    @IsString()
    @Transform(({ value }) => value?.trim())
    nama: string;

    @ApiPropertyOptional({
        example: 'john@example.com',
        description: 'Email address for response (optional)',
        required: false,
        type: String,
        format: 'email',
        maxLength: 100
    })
    @IsOptional()
    @IsEmail()
    @Transform(({ value }) => value?.trim())
    email?: string;

    @ApiProperty({
        example: '081234567890',
        description: 'Phone number for contact',
        required: true,
        type: String,
        maxLength: 20
    })
    @IsString()
    @Transform(({ value }) => value?.trim())
    no_hp: string;

    @ApiProperty({
        example: 'Saya menyarankan perbaikan pada layanan obat di puskesma',
        description: 'Feedback message content',
        required: true,
        type: String,
        maxLength: 2000
    })
    @IsString()
    @Transform(({ value }) => value?.trim())
    pesan: string;

    @ApiPropertyOptional({
        enum: KritikSaranKategori,
        example: KritikSaranKategori.SARAN,
        description: 'Category of feedback: "kritik" (criticism) or "saran" (suggestion). Defaults to "saran".',
        required: false,
        enumName: 'KritikSaranKategori',
        default: KritikSaranKategori.SARAN
    })
    @IsOptional()
    @IsEnum(KritikSaranKategori)
    kategori?: KritikSaranKategori = KritikSaranKategori.SARAN;
}

/**
 * Data Transfer Object for updating feedback status
 */
export class UpdateKritikSaranDto {
    @ApiPropertyOptional({
        enum: KritikSaranStatus,
        example: KritikSaranStatus.DIBACA,
        description: 'Status of the feedback: 0 = baru (new), 1 = dibaca (read), 2 = diproses (processed)',
        required: false,
        enumName: 'KritikSaranStatus',
        default: KritikSaranStatus.BARU
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(2)
    status?: KritikSaranStatus;
}

/**
 * Query parameters for filtering feedback
 */
export class KritikSaranQueryDto {
    @ApiPropertyOptional({
        example: 1,
        description: 'Page number for pagination (starts from 1)',
        required: false,
        type: Number,
        default: 1
    })
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    page?: number = 1;

    @ApiPropertyOptional({
        example: 10,
        description: 'Number of items per page',
        required: false,
        type: Number,
        default: 10
    })
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    limit?: number = 10;

    @ApiPropertyOptional({
        enum: KritikSaranKategori,
        example: KritikSaranKategori.SARAN,
        description: 'Filter by feedback category',
        required: false,
        enumName: 'KritikSaranKategori'
    })
    @IsOptional()
    @IsEnum(KritikSaranKategori)
    kategori?: KritikSaranKategori;

    @ApiPropertyOptional({
        enum: KritikSaranStatus,
        example: KritikSaranStatus.BARU,
        description: 'Filter by feedback status',
        required: false,
        enumName: 'KritikSaranStatus'
    })
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    status?: KritikSaranStatus;
}
