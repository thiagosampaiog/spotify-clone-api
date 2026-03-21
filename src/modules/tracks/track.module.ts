import { Module } from '@nestjs/common'
import { TrackController } from './track.controller'
import { TrackService } from './track.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Track, TrackSchema } from './contract/track.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }])],
  providers: [TrackService],
  controllers: [TrackController]
})
export class TrackModule {}
