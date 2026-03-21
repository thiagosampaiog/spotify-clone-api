import { Module } from '@nestjs/common'
import { AlbumService } from './album.service'
import { AlbumController } from './album.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Album, AlbumSchema } from './contract/album.schema'
import { Artist, ArtistSchema } from '../artists/contract/artists.schema'

@Module({
  providers: [AlbumService],
  controllers: [AlbumController],
  imports: [MongooseModule.forFeature([
    { name: Album.name, schema: AlbumSchema }, 
    { name: Artist.name, schema: ArtistSchema }
  ])]
})
export class AlbumModule {}
