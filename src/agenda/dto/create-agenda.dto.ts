import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateAgendaDto {
  @IsNotEmpty({ message: 'Nama aktivitas wajib diisi' })
  @IsString()
  activity_name: string;

  @IsNotEmpty({ message: 'Tanggal agenda wajib diisi' })
  @IsDateString({}, { message: 'Format tanggal salah (gunakan YYYY-MM-DD)' })
  date: string; // Dikirim string dari FE, nanti disimpan Date di DB

  @IsNotEmpty({ message: 'Waktu wajib diisi' })
  @IsString()
  time: string; // Contoh: "09:00 - 12:00"

  @IsNotEmpty({ message: 'Lokasi wajib diisi' })
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  effective_date?: string; // Boleh kosong (masa berlaku)
}