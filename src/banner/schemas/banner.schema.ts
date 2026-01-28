// src/banner/schemas/banner.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BannerDocument = Banner & Document;

@Schema({ timestamps: true }) 
export class Banner {
  @Prop({ required: true })
  image_path: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  is_publish: boolean;

  @Prop({ default: 0, select: false }) 
  is_deleted: number; 
}

export const BannerSchema = SchemaFactory.createForClass(Banner);