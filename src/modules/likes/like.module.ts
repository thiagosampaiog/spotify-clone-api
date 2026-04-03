import { Module } from '@nestjs/common'
import { LikeService } from './like.service'
import { LikeController } from './like.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Like, LikeSchema } from './contract/like.schema'
import { Album, AlbumSchema } from '../albums/contract/album.schema'
import { Track, TrackSchema } from '../tracks/contract/track.schema'
import { Playlist, PlaylistSchema } from '../playlists/contract/playlist.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Like.name, schema: LikeSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Track.name, schema: TrackSchema },
      { name: Playlist.name, schema: PlaylistSchema }
    ])
  ],
  providers: [LikeService],
  controllers: [LikeController]
})
export class LikeModule {}
