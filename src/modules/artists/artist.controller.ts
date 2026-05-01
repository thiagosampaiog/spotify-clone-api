import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { Artist } from './contract/artists.schema'
import { ArtistsService } from './artist.service'
import { CreateArtistDto, UpdateArtistDto } from './contract/artist.dto'
import { Public } from '@app/common/decorators/public.decorator'
import { Roles } from '@app/common/decorators/role.decorator'
import { UserRole } from '@common/types/enums'

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Public()
  @Get()
  async findAll(): Promise<Artist[]> {
    return this.artistsService.findAll()
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') artistId: string): Promise<Artist> {
    return this.artistsService.findById(artistId)
  }

  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() input: CreateArtistDto): Promise<Artist> {
    return this.artistsService.create(input)
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(@Body() input: UpdateArtistDto, @Param('id') artistId: string): Promise<Artist> {
    return this.artistsService.update(input, artistId)
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async delete(@Param('id') artistId: string): Promise<Artist> {
    return this.artistsService.delete(artistId)
  }
}
