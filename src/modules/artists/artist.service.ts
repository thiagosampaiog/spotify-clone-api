import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Model } from 'mongoose';
import { Artist } from './schemas/artists.schema';
import { CreateArtistDto } from './dto/create-artist.dto';
import { MONGO_ERRORS } from '@app/common/constants';
import type { UpdateArtistDto } from './dto/update-artist.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<Artist>,
  ) {}

  async findAll(): Promise<Artist[]> {
    return this.artistModel.find().lean().exec();
  }

  async findById(id: string): Promise<Artist> {
    const found = await this.artistModel.findById(id).lean().exec();
    if (!found) throw new NotFoundException('Artist not found');
    return found;
  }

  async create(input: CreateArtistDto): Promise<Artist> {
    try {
      const created = await this.artistModel.create(input);
      return created.toObject();
    } catch (error) {
      if (error.code === MONGO_ERRORS.DUPLICATE_KEY) {
        throw new ConflictException('Artist with this name already exists.');
      }
      throw error;
    }
  }

  async update(input: UpdateArtistDto, artistId: string): Promise<Artist> {
    const updated = await this.artistModel
      .findOneAndUpdate(
        { _id: artistId },
        { $set: input },
        { returnDocument: 'after' },
      )
      .lean()
      .exec();
    if (!updated) throw new NotFoundException(`Artist ${artistId} not found`);
    return updated;
  }

  async delete(artistId: string): Promise<void> {
    const deleted = await this.artistModel.findByIdAndDelete(artistId).exec();
    if (!deleted) {
      throw new NotFoundException(`Artist ${artistId} not found`);
    }
  }
}
