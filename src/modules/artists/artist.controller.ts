import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { Artist } from './contract/artists.schema'
import { ArtistsService } from './artist.service'
import { CreateArtistDto, UpdateArtistDto } from './contract/artist.dto'

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  async findAll(): Promise<Artist[]> {
    return this.artistsService.findAll()
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Artist> {
    return this.artistsService.findById(id)
  }

  @Post()
  async create(@Body() input: CreateArtistDto): Promise<Artist> {
    return this.artistsService.create(input)
  }

  @Patch(':id')
  async update(@Body() input: UpdateArtistDto, @Param('id') artistId: string): Promise<Artist> {
    return this.artistsService.update(input, artistId)
  }

  @Delete(':id')
  async delete(@Param('id') artistId: string): Promise<void> {
    return this.artistsService.delete(artistId)
  }
}
