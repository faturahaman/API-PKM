import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type AlbumDocument = HydratedDocument<Album>;

@Schema({ timestamps: true })
export class Album {
  @Prop({ required: true })
  album_title: string;

  @Prop()
  album_cover: string;

  @Prop({ default: 0 })
  count: number;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
AlbumSchema.plugin(mongoosePaginate);