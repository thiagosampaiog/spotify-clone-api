import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Model } from 'mongoose'
import { Artist } from './contract/artists.schema'
import { CreateArtistDto, type UpdateArtistDto } from './contract/artist.dto'
import { MONGO_ERRORS } from '@app/common/constants'
import { InjectModel } from '@nestjs/mongoose'
import { Status } from '@app/common/enums'

@Injectable()
export class ArtistsService {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<Artist>
  ) {}

  async findAll(): Promise<Artist[]> {
    return this.artistModel.find().lean().exec()
  }

  async findById(id: string): Promise<Artist> {
    const found = await this.artistModel.findById(id).lean().exec()
    if (!found) throw new NotFoundException('Artist not found')
    return found
  }

  async create(input: CreateArtistDto): Promise<Artist> {
    try {
      const entity = new this.artistModel({ ...input, status: Status.ACTIVE })
      await entity.save()
      return entity.toObject()
    } catch (error) {
      if (error.code === MONGO_ERRORS.DUPLICATE_KEY) {
        throw new ConflictException('Artist already exists.')
      }
      throw error
    }
  }

  async update(input: UpdateArtistDto, artistId: string): Promise<Artist> {
    const updated = await this.artistModel
      .findOneAndUpdate({ _id: artistId }, { $set: input }, { returnDocument: 'after' })
      .lean()
      .exec()
    if (!updated) throw new NotFoundException(`Artist ${artistId} not found`)
    return updated
  }

  async delete(artistId: string): Promise<void> {
    const deleted = await this.artistModel.findByIdAndDelete(artistId).exec()
    if (!deleted) {
      throw new NotFoundException(`Artist ${artistId} not found`)
    }
  }
}
