import { Status } from '@common/types/enums'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ArtistDocument = HydratedDocument<Artist>

@Schema({ timestamps: true })
export class Artist {
  @Prop({ required: true, unique: true, trim: true })
  name: string

  @Prop({ required: true })
  bio: string

  @Prop({ required: true })
  imageUrl: string

  @Prop({ default: Status.ACTIVE, enum: Status })
  status: Status

  @Prop({ default: null, required: false })
  deletedAt: Date
}

export const ArtistSchema = SchemaFactory.createForClass(Artist)
