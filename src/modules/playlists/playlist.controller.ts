import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
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
  @Post()
  async create(@Body() input: CreatePlaylistDto, @CurrentUser() user: AuthenticatedUser): Promise<Playlist> {
    const userId = user.sub
    return this.playlistService.create(input, userId)
  }

  @Roles(UserRole.ADMIN, UserRole.DEFAULT)
  @Post(':id/tracks')
  async addTrack(
    @Body() input: AddPlaylistTrackDto,
    @Param('id') playlistId: string,
    @CurrentUser() user: AuthenticatedUser
  ): Promise<Playlist> {
    const userId = user.sub
    return this.playlistService.addTrack(input, playlistId, userId)
  }

  @Delete(':id/tracks/:entryId')
  async removeTrack(
    @Param('id') playlistId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param('entryId') entryId: string
  ): Promise<Playlist> {
    const userId = user.sub
    return this.playlistService.removeTrack(playlistId, userId, entryId)
  }

  @Patch(':id')
  async update(
    @Body() input: UpdatePlaylistDto,
    @Param('id') playlistId: string,
    @CurrentUser() user: AuthenticatedUser
  ): Promise<Playlist> {
    const userId = user.sub
    return this.playlistService.update(input, playlistId, userId)
  }

  @Get()
  async findAll(@Query('mine') mine: boolean = false, @CurrentUser() user?: AuthenticatedUser) {
    const userId = user?.sub
    return this.playlistService.findAll(userId, mine)
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') playlistId: string, @CurrentUser() user?: AuthenticatedUser) {
    const userId = user?.sub
    return this.playlistService.findOne(playlistId, userId)
  }

  @Delete(':id')
  async delete(@Param('id') playlistId: string, @CurrentUser() user: AuthenticatedUser) {
    const userId = user.sub
    return this.playlistService.delete(playlistId, userId)
  }
}
