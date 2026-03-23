import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Album } from './contract/album.schema'
import { Model } from 'mongoose'
import { CreateAlbumDto } from './contract/album.dto'
import { MONGO_ERRORS } from '@app/common/constants'
import { Artist } from '../artists/contract/artists.schema'
import { Status } from '@app/common/enums'

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<Album>,
    @InjectModel(Artist.name)
    private artistModel: Model<Artist>
  ) {}

  async create(input: CreateAlbumDto): Promise<Album> {
    try {
      // one artist cannot have two albums with same name
      // I added an index to handle concurrency
      // If two users saves the same album the index will catch the error
      // I removed the findOne because exists is better

      const exists = await this.artistModel.exists({ _id: input.artist })
      if (!exists) throw new NotFoundException(`Artist not found`)

      const entity = new this.albumModel({
        name: input.name,
        artist: input.artist,
        genres: input.genres,
        imageUrl: input.imageUrl,
        releasedAt: input.releasedAt || new Date(),
        status: Status.ACTIVE
      })

      await entity.save()
      return entity.toObject()
    } catch (error) {
      if (error.code === MONGO_ERRORS.DUPLICATE_KEY) {
        throw new ConflictException('Album already exists')
      }
      throw error
    }
  }

  async findById(albumId: string): Promise<Album> {
    const entity = await this.albumModel.findById(albumId).lean().exec()
    if (!entity) throw new NotFoundException(`Album not found`)
    return entity
  }

  async findAll(): Promise<Album[]> {
    return this.albumModel.find()
  }
}
