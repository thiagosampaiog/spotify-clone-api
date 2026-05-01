import { Status } from '@common/types/enums'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

export type PlaylistDocument = mongoose.HydratedDocument<Playlist>

@Schema()
export class TracksNested {
  _id: mongoose.Types.ObjectId

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Track' })
  track: mongoose.Types.ObjectId

  @Prop({ default: Date.now })
  addedAt: Date
}

export const TracksNestedSchema = SchemaFactory.createForClass(TracksNested)

@Schema({ timestamps: true })
export class Playlist {
  _id: mongoose.Types.ObjectId

  @Prop({ required: true })
  name: string

  @Prop({ type: [TracksNestedSchema], default: [] })
  tracks: TracksNested[]

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

  @Prop({ default: true })
  isPublic: boolean

  @Prop({ default: null, required: false })
  deletedAt: Date
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist)

// find playlist by user
PlaylistSchema.index({ user: 1, name: 1 })
PlaylistSchema.index({ 'tracks.track': 1 })
