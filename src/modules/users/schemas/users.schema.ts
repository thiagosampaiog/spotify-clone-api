import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ index: true, unique: true, required: true })
  name: string;

  @Prop({ required: true })
  imageUrl: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
