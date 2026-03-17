import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type ArtistDocument = HydratedDocument<Artist>;

@Schema({ timestamps: true })
export class Artist {
  @Prop({ required: true, index: true, unique: true, trim: true })
  name: string;

  @Prop()
  bio: string;

  @Prop()
  imageUrl: string;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
