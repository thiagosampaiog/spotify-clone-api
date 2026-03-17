import { Module } from '@nestjs/common';
import { ArtistsController } from './artist.controller';
import { ArtistsService } from './artist.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './schemas/artists.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
  ],
  controllers: [ArtistsController],
  providers: [ArtistsService],
})
export class ArtistModule {}
