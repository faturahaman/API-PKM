import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type ReviewDocument = Review & Document;

// Enum sederhana buat kategori (bisa ditambahin nanti)
export enum ReviewCategory {
  PELAYANAN = 'Pelayanan',
  FASILITAS = 'Fasilitas',
  TENAGA_MEDIS = 'Tenaga Medis',
  LAINNYA = 'Lainnya',
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Review {
  @Prop({ default: 'Anonim' }) // Kalau kosong, otomatis jadi "Anonim"
  username: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, enum: ReviewCategory }) // Validasi Enum
  category: string;

  @Prop({ default: false }) // Default false biar direview admin dulu
  is_publish: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.plugin(mongoosePaginate);