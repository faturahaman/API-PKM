import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


export type AgendaDocument = Agenda & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Agenda {
  @Prop({ required: true })
  activity_name: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  location: string;

  @Prop({ default: null })
  effective_date: string;

  @Prop({ default: false })
  is_deleted: boolean;

  timestamp: true;
}

export const AgendaSchema = SchemaFactory.createForClass(Agenda);
AgendaSchema.plugin(mongoosePaginate);