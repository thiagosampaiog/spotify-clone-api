import { Status, UserRole } from '@app/common/types/enums'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
  _id: mongoose.Types.ObjectId

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  name: string

  @Prop({ default: UserRole.DEFAULT, enum: UserRole })
  role: UserRole

  @Prop({ required: true })
  imageUrl: string

  @Prop({ default: Status.ACTIVE, enum: Status })
  status: Status

  @Prop({ default: null, required: false })
  deletedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)

// find user by name
UserSchema.index({ name: 1 })
