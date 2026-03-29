import { Body, Controller, Delete, Get, HostParam, Param, Patch, Post } from '@nestjs/common'
import { PlaylistService } from './playlist.service'
import { Playlist } from './contract/playlist.schema'
import { AddPlaylistTrackDto, CreatePlaylistDto, UpdatePlaylistDto } from './contract/playlist.dto'

@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post('users/:userId')
  async create(@Body() input: CreatePlaylistDto, @Param('userId') userId: string): Promise<Playlist> {
    return this.playlistService.create(input, userId)
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

  @Delete(':playlistId/users/:userId/tracks/:entryId')
  async removeTrack(
    @Param('playlistId') playlistId: string,
    @Param('userId') userId: string,
    @Param('trackId') entryId: string
  ): Promise<Playlist> {
    return this.playlistService.removeTrack(playlistId, userId, entryId)
  }

  @Get(':id/users/:userId')
  async findOneMyPlaylist(@Param('id') playlistId: string, @Param('userId') userId: string): Promise<Playlist> {
    return this.playlistService.findOneMyPlaylist(playlistId, userId)
  }

  @Patch(':playlistId/users/:userId')
  async update(
    @Body() input: UpdatePlaylistDto,
    @Param('playlistId') playlistId: string,
    @Param('userId') userId: string
  ): Promise<Playlist> {
    return this.playlistService.update(input, playlistId, userId)
  }

  @Get('users/:userId')
  async findAllMyPlaylists(@Param('userId') userId: string): Promise<Playlist[]> {
    return this.playlistService.findAllMyPlaylists(userId)
  }

  @Get()
  async findAllPublic() {
    return this.playlistService.findAllPublic()
  }

  @Get(':playlistId')
  async findOnePublic(@Param('playlistId') playlistId: string) {
    return this.playlistService.findOnePublic(playlistId)
  }

  @Delete(':playlistId/users/:userId')
  async delete(@Param('playlistId') playlistId: string, @Param('userId') userId: string) {
    return this.playlistService.delete(playlistId, userId)
  }
}
