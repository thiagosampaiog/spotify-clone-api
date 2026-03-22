import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { PlaylistService } from './playlist.service'
import { Playlist } from './contract/playlist.schema'
import { CreatePlaylistDto } from './contract/playlist.dto'

@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  async create(@Body() input: CreatePlaylistDto): Promise<Playlist> {
    return this.playlistService.create(input)
  }

  @Get(':id')
  async findById(@Param('id') playlistId: string): Promise<Playlist> {
    return this.playlistService.findById(playlistId)
  }

  @Get()
  async findAll(): Promise<Playlist[]> {
    return this.playlistService.findAll()
  }
}
