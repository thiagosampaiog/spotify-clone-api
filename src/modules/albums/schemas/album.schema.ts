import { Artist } from '@app/modules/artists/schemas/artists.schema'
import { Prop, Schema } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

@Schema({ timestamps: true })
export class Album {
  
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  imageUrl: string

  @Prop({ default: 0 })
  totalTracks: number

  @Prop({ default: 0 })
  totalDurationMs: number

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Artist' })
  artist: Artist
}
