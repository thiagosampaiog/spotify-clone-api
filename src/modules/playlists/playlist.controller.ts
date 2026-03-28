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
  @Post(':playlistId/users/:userId/tracks')
  async addTrack(
    @Body() input: AddPlaylistTrackDto,
    @Param('playlistId') playlistId: string,
    @Param('userId') userId: string
  ): Promise<Playlist> {
    return this.playlistService.addTrack(input, playlistId, userId)
  }

  // Should be removed later? or just check userId
  @Get(':id')
  async findById(@Param('id') playlistId: string): Promise<Playlist> {
    return this.playlistService.findById(playlistId)
  }

  @Patch(':playlistId/users/:userId')
  async update(@Body() input: UpdatePlaylistDto, @Param('playlistId') playlistId: string, @Param('userId') userId: string): Promise<Playlist> {
    return this.playlistService.update(input, playlistId, userId)
  }

  // find /me playlists
  @Get('users/:userId')
  async findAll(@Param('userId') userId: string): Promise<Playlist[]> {
    return this.playlistService.findAll(userId)
  }

  @Delete(':playlistId/users/:userId')
  async delete(@Param('playlistId') playlistId: string, @Param('userId') userId: string) {
    return this.playlistService.delete(playlistId, userId)
  }
}
