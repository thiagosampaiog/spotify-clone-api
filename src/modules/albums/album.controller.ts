import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from '@nestjs/common'
import { AlbumService } from './album.service'
import { CreateAlbumDto, UpdateAlbumDto } from './contract/album.dto'
import { Album } from './contract/album.schema'

@Controller('albums')
export class AlbumController {
  constructor(
    @Inject()
    private albumService: AlbumService
  ) {}

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

  @Patch(':albumId')
  async update(@Body() input: UpdateAlbumDto, @Param('albumId') albumId: string): Promise<Album> {
    return this.albumService.update(input, albumId)
  }

  @Delete(':albumId')
  async delete(@Param('albumId') albumId: string): Promise<Album> {
    return this.albumService.delete(albumId)
  }
}
