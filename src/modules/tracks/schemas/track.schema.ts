import { Album } from '@app/modules/albums/schemas/album.schema'
import { Artist } from '@app/modules/artists/schemas/artists.schema'
import { Prop, Schema } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

@Schema({ timestamps: true })
export class Track {
  // releaseAt e imageUrl vem do pai, devo adicionar aqui?

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  imageUrl: string

  @Prop({ required: true })
  durationMs: number

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Album' })
  album: Album

  @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }] })
  artists: Artist[]
}
