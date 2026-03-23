import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Playlist, PlaylistSchema } from './contract/playlist.schema'
import { PlaylistController } from './playlist.controller'
import { PlaylistService } from './playlist.service'
import { User, UserSchema } from '../users/contract/users.schema'
import { Track, TrackSchema } from '../tracks/contract/track.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Playlist.name, schema: PlaylistSchema },
      { name: User.name, schema: UserSchema },
      { name: Track.name, schema: TrackSchema }
    ])
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService]
})
export class PlaylistModule {}
