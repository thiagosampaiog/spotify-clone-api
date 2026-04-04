import { Status } from '@app/common/types/enums'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

export type TrackDocument = mongoose.HydratedDocument<Track>

@Schema({ timestamps: true })
export class Track {
  @Prop({ required: true })
  name: string
  // this image is from album
  @Prop({ required: true })
  imageUrl: string

  @Prop({ required: true })
  audioUrl: string

  @Prop({ required: true })
  durationMs: number

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  })
  album: mongoose.Types.ObjectId

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }]
  })
  artists: mongoose.Types.ObjectId[]

  @Prop({ default: null, required: false })
  deletedAt: Date

  @Prop({ default: Status.ACTIVE, enum: Status })
  status: Status
}

export const TrackSchema = SchemaFactory.createForClass(Track)

// find tracks for search -> GET /search
TrackSchema.index({ name: 'text' })
// find tracks by artist name
TrackSchema.index({ artists: 1 })
// find tracks by album
TrackSchema.index({ album: 1, name: 1 })
