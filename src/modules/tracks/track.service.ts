import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Track } from './contract/track.schema'
import { Model } from 'mongoose'
import { CreateTrackDto } from './contract/track.dto'
import { MONGO_ERRORS } from '@app/common/constants'
import { Status } from '@app/common/enums'
import { Album } from '../albums/contract/album.schema'
import { Artist } from '../artists/contract/artists.schema'

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<Track>,
    @InjectModel(Album.name)
    private albumModel: Model<Album>,
    @InjectModel(Artist.name)
    private artistModel: Model<Artist>
  ) {}

  async create(input: CreateTrackDto): Promise<Track> {
    try {
      // TODO: transaction, mongo session

      const [album, artists] = await Promise.all([
        this.albumModel.findById(input.album).lean().exec(),
        this.artistModel
          .find({
            _id: { $in: input.artists }
          })
          .lean()
          .exec()
      ])

      if (!album) throw new NotFoundException(`Album not found`)
      if (artists.length !== input.artists.length) throw new NotFoundException('One or more artists not found')

      // TODO: extract real duration from audio file

      const entity = new this.trackModel({
        name: input.name,
        album: input.album,
        artists: input.artists,
        audioUrl: input.audioUrl,
        imageUrl: album.imageUrl,
        durationMs: 1000,
        status: Status.ACTIVE
      })

      await entity.save()

      this.albumModel
        .findByIdAndUpdate(album._id, {
          $inc: {
            totalTracks: 1,
            totalDurationMs: entity.durationMs
          }
        })
        .exec()

      return entity.toObject()
    } catch (error) {
      if (error.code === MONGO_ERRORS.DUPLICATE_KEY) {
        throw new ConflictException('Track already exists')
      }
      throw error
    }
  }

  async findById(trackId: string): Promise<Track> {
    const entity = await this.findById(trackId)
    if (!entity) throw new NotFoundException(`Track ${trackId} not found`)
    return entity
  }

  async findAll(): Promise<Track[]> {
    return this.trackModel.find()
  }
  
}
