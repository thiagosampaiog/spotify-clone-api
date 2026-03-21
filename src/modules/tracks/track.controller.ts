import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { TrackService } from './track.service'
import { CreateTrackDto } from './contract/track.dto'
import { Track } from './contract/track.schema'

@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  async create(@Body() input: CreateTrackDto) {
    return this.trackService.create(input)
  }

  @Get()
  async findAll(): Promise<Track[]> {
    return this.trackService.findAll()
  }

  @Get(':id')
  async findById(@Param('id') trackId: string): Promise<Track> {
    return this.trackService.findById(trackId)
  }
}
