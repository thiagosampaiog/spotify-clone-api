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

  @Get()
  async findAll(): Promise<Album[]> {
    return this.albumService.findAll()
  }

  @Get(':id')
  async findById(@Param('id') albumId: string): Promise<Album> {
    return this.albumService.findById(albumId)
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(@Body() input: UpdateAlbumDto, @Param('id') albumId: string): Promise<Album> {
    return this.albumService.update(input, albumId)
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async delete(@Param('id') albumId: string): Promise<Album> {
    return this.albumService.delete(albumId)
  }
}
