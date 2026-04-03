import { LikesTargets } from '@app/common/enums'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

export type LikeDocument = mongoose.HydratedDocument<Like>

@Schema({ timestamps: true })
export class Like {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true })
  user: mongoose.Types.ObjectId

  @Prop({ required: true, type: String, enum: LikesTargets })
  targetType: LikesTargets

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, refPath: 'targetType', index: true })
  targetId: mongoose.Types.ObjectId
}

export const LikeSchema = SchemaFactory.createForClass(Like)

LikeSchema.index({ user: 1, targetId: 1, targetType: 1 }, { unique: true })
