import { Body, Controller, Post } from '@nestjs/common'
import { TrackService } from './track.service'
import { CreateTrackDto } from './contract/track.dto'

@Controller()
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  async create(@Body() input: CreateTrackDto) {
    return this.trackService.create(input)
  }
}
