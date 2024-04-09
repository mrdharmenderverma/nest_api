import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
    timestamps: true
})

export class User extends Document{

    @Prop()
    name: string;

    @Prop({ unique: [true, 'Dublicate Email entered']})
    email: string;

    @Prop()
    password: string;
    
}

export const UserSchema = SchemaFactory.createForClass(User);



