import { Inject, Injectable } from '@nestjs/common';
import type { Model } from 'mongoose';
import { Artist, type ArtistDocument } from './schemas/artists.schema';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}

}
