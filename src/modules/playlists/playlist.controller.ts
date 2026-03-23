import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { PlaylistService } from './playlist.service'
import { Playlist } from './contract/playlist.schema'
import { AddPlaylistTrackDto, CreatePlaylistDto } from './contract/playlist.dto'

@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  async create(@Body() input: CreatePlaylistDto): Promise<Playlist> {
    return this.playlistService.create(input)
  }

  // I Added the id here just while I don't have jwt auth users/me
  @Post('users/:id')
  async addTrack(@Body() input: AddPlaylistTrackDto, @Param('id') userId: string ): Promise<Playlist>{
    return this.playlistService.addTrack(input, userId)
  }

  // find playlist Id
  @Get(':id')
  async findById(@Param('id') playlistId: string): Promise<Playlist> {
    return this.playlistService.findById(playlistId)
  }

  // find /me playlists 
  @Get()
  async findAll(): Promise<Playlist[]> {
    return this.playlistService.findAll()
  }

}
