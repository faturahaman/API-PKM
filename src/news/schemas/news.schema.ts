import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import  mongoosePaginate from 'mongoose-paginate-v2';

export type NewsDocument = News & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class News {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string; // Rich editor content (HTML string)

  @Prop({ required: true })
  day: string; // Contoh: "Senin"

  @Prop({ required: true })
  date: Date; // YYYY-MM-DD

  @Prop({ required: true })
  clock: string; // Contoh: "14:00"

  @Prop({ required: true })
  image: string; // Path URL gambar cover

  @Prop({ default: false })
  is_deleted: boolean;
}

export const NewsSchema = SchemaFactory.createForClass(News);
NewsSchema.plugin(mongoosePaginate);