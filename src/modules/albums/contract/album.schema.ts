import { Genres, Status } from '@app/common/types/enums'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

export type AlbumDocument = mongoose.HydratedDocument<Album>

@Schema({ timestamps: true })
export class Album {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  imageUrl: string

  @Prop({ required: true, type: [String], enum: Genres })
  genres: Genres[]

  @Prop({ default: 0 })
  totalTracks: number

  @Prop({ default: 0 })
  totalDurationMs: number

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Artist' })
  artist: mongoose.Types.ObjectId

  @Prop({ required: true })
  releasedAt: Date

  @Prop({ default: null, required: false })
  deletedAt: Date

  @Prop({ default: Status.ACTIVE, enum: Status })
  status: Status
}

export const AlbumSchema = SchemaFactory.createForClass(Album)

// find album by name
AlbumSchema.index({ name: 1 })
// find album by genre
AlbumSchema.index({ genres: 1 })
// find most recent album by artist
AlbumSchema.index({ artist: 1, releasedAt: -1 })
// find album by artist name, must be unique
AlbumSchema.index({ artist: 1, name: 1 }, { unique: true })
