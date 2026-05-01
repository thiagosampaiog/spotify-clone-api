import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { TrackService } from './track.service'
import { CreateTrackDto, UpdateTrackDto } from './contract/track.dto'
import { Track } from './contract/track.schema'
import { UserRole } from '@common/types/enums'
import { Roles } from '@app/common/decorators/role.decorator'
import { Public } from '@app/common/decorators/public.decorator'

@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  // PRIVATE, only admin
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() input: CreateTrackDto) {
    return this.trackService.create(input)
  }

  @Public()
  @Get()
  async findAll(): Promise<Track[]> {
    return this.trackService.findAll()
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') trackId: string): Promise<Track> {
    return this.trackService.findById(trackId)
  }

  // PRIVATE, only admin
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(@Body() input: UpdateTrackDto, @Param('id') trackId: string): Promise<Track> {
    return this.trackService.update(input, trackId)
  }

  // PRIVATE, only admin
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async delete(@Param('id') trackId: string): Promise<Track> {
    return this.trackService.delete(trackId)
  }
}
