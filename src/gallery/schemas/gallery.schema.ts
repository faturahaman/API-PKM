import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GalleryDocument = HydratedDocument<Gallery>;

@Schema({ timestamps: { createdAt: 'upload_date', updatedAt: false } })
export class Gallery {
  @Prop({ required: true })
  image_title: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  album_id: string; 
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);