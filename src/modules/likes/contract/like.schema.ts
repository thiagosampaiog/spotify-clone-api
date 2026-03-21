import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

export type LikeDocument = mongoose.HydratedDocument<Like>

@Schema({ timestamps: true })
export class Like {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true })
  user: mongoose.Types.ObjectId

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Track', index: true })
  track: mongoose.Types.ObjectId
}

export const LikeSchema = SchemaFactory.createForClass(Like)

LikeSchema.index({ user: 1, track: 1 }, { unique: true })
