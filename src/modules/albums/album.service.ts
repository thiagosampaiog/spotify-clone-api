import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Album } from './contract/album.schema'
import { Model } from 'mongoose'
import { CreateAlbumDto, UpdateAlbumDto } from './contract/album.dto'
import {
  ACTIVE_FILTER,
  ALBUM_DETAIL_SELECT,
  ALBUM_LITE_SELECT,
  ARTIST_DETAIL_SELECT,
  ARTIST_LITE_SELECT,
  MONGO_ERRORS
} from '@common/types/constants'
import { Artist } from '../artists/contract/artists.schema'
import { Status } from '@common/types/enums'

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
      // If two users saves the same album, the index will catch the error
      // I removed the findOne because exists is better

      const exists = await this.artistModel.exists({
        _id: input.artist,
        ...ACTIVE_FILTER
      })
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
    const entity = await this.albumModel
      .findOne({ _id: albumId, ...ACTIVE_FILTER })
      .select(ALBUM_DETAIL_SELECT)
      .populate({ path: 'artist', select: ARTIST_DETAIL_SELECT, match: ACTIVE_FILTER })
      .lean()
      .exec()
    if (!entity) throw new NotFoundException(`Album not found`)
    return entity
  }

  async findAll(): Promise<Album[]> {
    return this.albumModel
      .find({ ...ACTIVE_FILTER })
      .select(ALBUM_LITE_SELECT)
      .populate({ path: 'artist', select: ARTIST_LITE_SELECT, match: ACTIVE_FILTER })
      .lean()
      .exec()
  }

  async update(input: UpdateAlbumDto, albumId: string): Promise<Album> {
    if (input.artist) {
      const artistExists = await this.artistModel.exists({
        _id: input.artist,
        ...ACTIVE_FILTER
      })
      if (!artistExists) throw new NotFoundException('Artist not found')
    }

    const updated = await this.albumModel.findOneAndUpdate(
      {
        _id: albumId,
        ...ACTIVE_FILTER
      },
      {
        $set: input
      },
      {
        returnDocument: 'after'
      }
    )

    if (!updated) throw new NotFoundException('Album not found')
    return updated
  }

  async delete(albumId: string): Promise<Album> {
    const deleted = await this.albumModel.findOneAndUpdate(
      { _id: albumId, ...ACTIVE_FILTER },
      { $set: { status: Status.DELETED, deletedAt: new Date() } },
      {
        returnDocument: 'after'
      }
    )
    if (!deleted) throw new NotFoundException('Album not found')
    return deleted
  }
}
