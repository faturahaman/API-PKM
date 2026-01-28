import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AlbumDocument = HydratedDocument<Album>;

@Schema({ timestamps: true })
export class Album {
  @Prop({ required: true })
  album_title: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  album_cover: string;

}

export const AlbumSchema = SchemaFactory.createForClass(Album);