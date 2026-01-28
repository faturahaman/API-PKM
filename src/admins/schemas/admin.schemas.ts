import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true }) 
export class Admin {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: false, default: null })
    photo: string;

    @Prop({ 
        required: true, 
        default: "0", 
        enum: ["0", "1", "2"] // 0 = staff, 1 = admin, 2 = super admin
    })
    level: string; 

    @Prop({ required: true })
    password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);