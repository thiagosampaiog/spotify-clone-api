import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Playlist, PlaylistSchema } from './contract/playlist.schema'
import { PlaylistController } from './playlist.controller'
import { PlaylistService } from './playlist.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Playlist.name, schema: PlaylistSchema }])],
  controllers: [PlaylistController],
  providers: [PlaylistService]
})
export class PlaylistModule {}
