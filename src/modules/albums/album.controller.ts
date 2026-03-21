import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common'
import { AlbumService } from './album.service'
import { CreateAlbumDto } from './contract/album.dto'
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
}
