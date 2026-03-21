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
      const [album, artists] = await Promise.all([
        this.albumModel.findById(input.album).lean().exec(),
        await this.artistModel.find({
          _id: { $in: input.artists }
        })
      ])

      if (!album) throw new NotFoundException(`Album not found`)
      if (artists.length !== input.artists.length) throw new NotFoundException('One or more artists not found')

      // TODO: extract real duration from audio file

      const entity = new this.trackModel({
        name: input.name,
        audioUrl: input.audioUrl,
        album: album._id,
        artists: input.artists,
        imageUrl: album.imageUrl,
        durationMs: 1000,
        status: Status.ACTIVE
      })

      this.albumModel
        .findByIdAndUpdate(album._id, {
          $inc: {
            totalTracks: 1,
            totalDurationMs: entity.durationMs
          }
        })
        .exec()

      await entity.save()
      return entity.toObject()
    } catch (error) {
      if (error.code === MONGO_ERRORS.DUPLICATE_KEY) {
        throw new ConflictException('Track already exists')
      }
      throw error
    }
  }
}
