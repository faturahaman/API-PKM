import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
import { SanitizeText } from '../../common/decorators/sanitize.decorator';

export class CreateAgendaDto {
  @IsNotEmpty({ message: 'Nama aktivitas wajib diisi' })
  @IsString()
  @SanitizeText()
  activity_name: string;

  @IsNotEmpty({ message: 'Tanggal agenda wajib diisi' })
  @IsDateString({}, { message: 'Format tanggal salah (gunakan YYYY-MM-DD)' })
  date: string; // Dikirim string dari FE, nanti disimpan Date di DB

  @IsNotEmpty({ message: 'Waktu wajib diisi' })
  @IsString()
  @SanitizeText()
  time: string; // Contoh: "09:00 - 12:00"

  @IsNotEmpty({ message: 'Lokasi wajib diisi' })
  @IsString()
  @SanitizeText()
  location: string;

  @IsOptional()
  @IsString()
  @SanitizeText()
  effective_date?: string; // Boleh kosong (masa berlaku)
}