import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type VideoDocument = Video & Document;

@Schema({ timestamps: { createdAt: 'upload_date', updatedAt: true } })
export class Video {
  @Prop({ required: true })
  video_title: string;

  @Prop()
  video_desc: string;

  @Prop({ required: true })
  data: string;

  @Prop({ required: true, default: false })
  is_embed: boolean;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
VideoSchema.plugin(mongoosePaginate);