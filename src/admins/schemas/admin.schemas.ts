import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true }) 
export class Admin {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: false, default: null })
    photo: string;

    @Prop({ 
        required: true, 
        default: "staff", 
        enum: ["superadmin", "editor", "staff"] 
    })
    level: string; 

    @Prop({ required: true })
    password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);