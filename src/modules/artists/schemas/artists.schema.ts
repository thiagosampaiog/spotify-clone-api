import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ArtistDocument = HydratedDocument<Artist>

@Schema({ timestamps: true })
export class Artist {
  @Prop({ required: true, index: true, unique: true, trim: true })
  name: string

  @Prop({ required: true })
  bio: string

  @Prop({ required: true })
  imageUrl: string
}

export const ArtistSchema = SchemaFactory.createForClass(Artist)
