import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Track } from './contract/track.schema'
import { Model } from 'mongoose'
import { CreateTrackDto, UpdateTrackDto } from './contract/track.dto'
import {
  ACTIVE_FILTER,
  ALBUM_DETAIL_SELECT,
  ALBUM_LITE_SELECT,
  ARTIST_DETAIL_SELECT,
  ARTIST_LITE_SELECT,
  MONGO_ERRORS,
  POPULATE_SELECT,
  TRACK_DETAIL_SELECT,
  TRACK_LITE_SELECT
} from '@app/common/types/constants'
import { Status } from '@app/common/types/enums'
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

      const [album, artistsCount] = await Promise.all([
        this.albumModel
          .findOne({ _id: input.album, ...ACTIVE_FILTER })
          .lean()
          .exec(),
        this.artistModel
          .countDocuments({
            _id: { $in: input.artists },
            ...ACTIVE_FILTER
          })
          .lean()
          .exec()
      ])

      if (!album) throw new NotFoundException(`Album not found`)
      if (artistsCount !== input.artists.length) throw new NotFoundException('One or more artists not found')

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

      await this.albumModel
        .updateOne(
          { _id: album._id },
          {
            $inc: {
              totalTracks: 1,
              totalDurationMs: entity.durationMs
            }
          }
        )
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
    const entity = await this.trackModel
      .findOne({
        _id: trackId,
        ...ACTIVE_FILTER
      })
      .select(TRACK_DETAIL_SELECT)
      .populate([
        { path: 'artists', select: ARTIST_DETAIL_SELECT },
        { path: 'album', select: ALBUM_DETAIL_SELECT }
      ])
      .lean()
      .exec()
    if (!entity) throw new NotFoundException(`Track not found`)
    return entity
  }

  async findAll(): Promise<Track[]> {
    return this.trackModel
      .find({ ...ACTIVE_FILTER })
      .select(TRACK_LITE_SELECT)
      .populate([
        { path: 'album', select: ALBUM_LITE_SELECT, match: ACTIVE_FILTER },
        { path: 'artists', select: ARTIST_LITE_SELECT, match: ACTIVE_FILTER }
      ])
      .lean()
      .exec()
  }

  async update(input: UpdateTrackDto, trackId: string): Promise<Track> {
    if (input.album) {
      const albumExists = await this.albumModel.exists({ _id: input.album, ...ACTIVE_FILTER }).exec()
      if (!albumExists) throw new NotFoundException('Album not found')
    }

    if (input.artists && input.artists.length > 0) {
      const artistsCount = await this.artistModel
        .countDocuments({
          _id: { $in: input.artists },
          ...ACTIVE_FILTER
        })
        .exec()

      if (artistsCount !== input.artists.length) {
        throw new BadRequestException('One or more invalid artists are invalid')
      }
    }

    const updated = await this.trackModel
      .findOneAndUpdate(
        {
          _id: trackId,
          ...ACTIVE_FILTER
        },
        {
          $set: input
        },
        { returnDocument: 'after' }
      )
      .exec()
    if (!updated) throw new NotFoundException('Track not found')
    return updated
  }

  async delete(trackId: string): Promise<Track> {
    const deleted = await this.trackModel
      .findOneAndUpdate(
        { _id: trackId, ...ACTIVE_FILTER },
        {
          status: Status.DELETED,
          deletedAt: new Date()
        },
        { returnDocument: 'after' }
      )
      .exec()
    if (!deleted) throw new NotFoundException('Track not found')
    return deleted
  }
}
