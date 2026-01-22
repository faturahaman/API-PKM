import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true }) 
export class Admin {
    @Prop({ required: true, unique: true })
    name: string;

    // Ubah jadi required: false dulu biar ga error kalau data lama ga punya email
    @Prop({ required: false }) 
    email: string;

    @Prop({ required: false, default: null })
    photo: string;

    // PENTING: Ganti 'role' jadi 'level' supaya cocok sama Database & Auth Service
    @Prop({ 
        required: true, 
        default: "staff", 
        enum: ["superadmin", "editor", "staff"] // Sesuaikan enum dengan kebutuhan
    })
    level: string; 

    @Prop({ required: true })
    password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);