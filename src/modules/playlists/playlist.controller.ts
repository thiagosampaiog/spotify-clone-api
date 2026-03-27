import { Body, Controller, Delete, Get, HostParam, Param, Patch, Post } from '@nestjs/common'
import { PlaylistService } from './playlist.service'
import { Playlist } from './contract/playlist.schema'
import { AddPlaylistTrackDto, CreatePlaylistDto, UpdatePlaylistDto } from './contract/playlist.dto'

@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  async create(@Body() input: CreatePlaylistDto): Promise<Playlist> {
    return this.playlistService.create(input)
  }

  // I Added the id here just while I don't have jwt auth users/me
  @Post('users/:id')
  async addTrack(@Body() input: AddPlaylistTrackDto, @Param('id') userId: string): Promise<Playlist> {
    return this.playlistService.addTrack(input, userId)
  }

  // Should be removed later? or just check userId
  @Get(':id')
  async findById(@Param('id') playlistId: string): Promise<Playlist> {
    return this.playlistService.findById(playlistId)
  }

  @Patch(':id')
  async update(@Body() input: UpdatePlaylistDto, @Param('id') playlistId: string): Promise<Playlist> {
    return this.playlistService.update(input, playlistId)
  }

  // find /me playlists
  @Get()
  async findAll(): Promise<Playlist[]> {
    return this.playlistService.findAll()
  }

  @Delete(':id/users/:userId')
  async delete(@Param('id') playlistId: string, @Param('userId') userId: string) {
    return this.playlistService.delete(playlistId, userId)
  }
}
