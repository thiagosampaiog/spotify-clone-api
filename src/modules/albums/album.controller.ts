import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from '@nestjs/common'
import { AlbumService } from './album.service'
import { CreateAlbumDto, UpdateAlbumDto } from './contract/album.dto'
import { Album } from './contract/album.schema'
import { Roles } from '@app/common/decorators/role.decorator'
import { UserRole } from '@app/common/guards/types/enums'

@Controller('albums')
export class AlbumController {
  constructor(
    @Inject()
    private albumService: AlbumService
  ) {}

  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() input: CreateAlbumDto) {
    return this.albumService.create(input)
  }

  @Roles(UserRole.ADMIN, UserRole.DEFAULT)
  @Get()
  async findAll(): Promise<Album[]> {
    return this.albumService.findAll()
  }

  @Roles(UserRole.ADMIN, UserRole.DEFAULT)
  @Get(':id')
  async findById(@Param('id') albumId: string): Promise<Album> {
    return this.albumService.findById(albumId)
  }

  @Roles(UserRole.ADMIN)
  @Patch(':albumId')
  async update(@Body() input: UpdateAlbumDto, @Param('albumId') albumId: string): Promise<Album> {
    return this.albumService.update(input, albumId)
  }

  @Roles(UserRole.ADMIN)
  @Delete(':albumId')
  async delete(@Param('albumId') albumId: string): Promise<Album> {
    return this.albumService.delete(albumId)
  }
}
