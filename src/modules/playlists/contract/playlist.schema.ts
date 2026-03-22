import { Status } from '@app/common/enums'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

export type PlaylistDocument = mongoose.HydratedDocument<Playlist>

@Schema({ timestamps: true })
export class Playlist {
  @Prop({ required: true })
  name: string

  @Prop({ default: null, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }] })
  tracks?: mongoose.Types.ObjectId[]

  @Prop({ default: 0 })
  totalTracks: number

  @Prop({ default: 0 })
  totalDurationMs: number

  @Prop({ default: null })
  imageUrl: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId

  @Prop({ default: Status.ACTIVE, enum: Status })
  status: Status
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist)

// find playlist by user
PlaylistSchema.index({ user: 1, name: 1 })
PlaylistSchema.index({ tracks: 1 })
