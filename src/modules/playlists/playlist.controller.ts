import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { PlaylistService } from './playlist.service'
import { Playlist } from './contract/playlist.schema'
import { AddPlaylistTrackDto, CreatePlaylistDto, UpdatePlaylistDto } from './contract/playlist.dto'
import { CurrentUser } from '@app/common/decorators/current-user.decorator'
import type { AuthenticatedUser } from '@app/common/guards/types/jwt.constant'
import { Public } from '@app/common/decorators/public.decorator'
import { Roles } from '@app/common/decorators/role.decorator'
import { UserRole } from '@app/common/guards/types/enums'

@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Roles(UserRole.ADMIN, UserRole.DEFAULT)
  @Post('users/me')
  async create(@Body() input: CreatePlaylistDto, @CurrentUser() user: AuthenticatedUser): Promise<Playlist> {
    const userId = user.sub
    return this.playlistService.create(input, userId)
  }

  @Roles(UserRole.ADMIN, UserRole.DEFAULT)
  @Post(':playlistId/users/me/tracks')
  async addTrack(
    @Body() input: AddPlaylistTrackDto,
    @Param('playlistId') playlistId: string,
    @CurrentUser() user: AuthenticatedUser
  ): Promise<Playlist> {
    const userId = user.sub
    return this.playlistService.addTrack(input, playlistId, userId)
  }

  @Roles(UserRole.ADMIN, UserRole.DEFAULT)
  @Delete(':playlistId/users/me/tracks/:entryId')
  async removeTrack(
    @Param('playlistId') playlistId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param('entryId') entryId: string
  ): Promise<Playlist> {
    const userId = user.sub
    return this.playlistService.removeTrack(playlistId, userId, entryId)
  }

  @Roles(UserRole.ADMIN, UserRole.DEFAULT)
  @Get(':id/users/me')
  async findOneMyPlaylist(
    @Param('id') playlistId: string,
    @CurrentUser() user: AuthenticatedUser
  ): Promise<Playlist> {
    const userId = user.sub
    return this.playlistService.findOneMyPlaylist(playlistId, userId)
  }

  @Roles(UserRole.ADMIN, UserRole.DEFAULT)
  @Patch(':playlistId/users/me')
  async update(
    @Body() input: UpdatePlaylistDto,
    @Param('playlistId') playlistId: string,
    @CurrentUser() user: AuthenticatedUser
  ): Promise<Playlist> {
    const userId = user.sub
    return this.playlistService.update(input, playlistId, userId)
  }

  @Roles(UserRole.ADMIN, UserRole.DEFAULT)
  @Get('users/me')
  async findAllMyPlaylists(@CurrentUser() user: AuthenticatedUser): Promise<Playlist[]> {
    const userId = user.sub
    return this.playlistService.findAllMyPlaylists(userId)
  }

  @Public()
  @Roles(UserRole.ADMIN, UserRole.DEFAULT)
  @Get()
  async findAllPublic() {
    return this.playlistService.findAllPublic()
  }

  @Public()
  @Roles(UserRole.ADMIN, UserRole.DEFAULT)
  @Get(':playlistId')
  async findOnePublic(@Param('playlistId') playlistId: string) {
    return this.playlistService.findOnePublic(playlistId)
  }

  @Delete(':playlistId/users/me')
  async delete(@Param('playlistId') playlistId: string, @CurrentUser() user: AuthenticatedUser) {
    const userId = user.sub
    return this.playlistService.delete(playlistId, userId)
  }
}
