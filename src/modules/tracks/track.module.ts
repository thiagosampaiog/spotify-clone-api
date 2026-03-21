import { Module } from '@nestjs/common'
import { TrackController } from './track.controller'
import { TrackService } from './track.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Track, TrackSchema } from './contract/track.schema'
import { Album, AlbumSchema } from '../albums/contract/album.schema'
import { Artist, ArtistSchema } from '../artists/contract/artists.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Track.name, schema: TrackSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Artist.name, schema: ArtistSchema }
    ])
  ],
  providers: [TrackService],
  controllers: [TrackController]
})
export class TrackModule {}
