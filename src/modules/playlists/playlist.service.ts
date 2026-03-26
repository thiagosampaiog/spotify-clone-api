import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Playlist } from './contract/playlist.schema'
import { AddPlaylistTrackDto, CreatePlaylistDto, UpdatePlaylistDto } from './contract/playlist.dto'
import { MONGO_ERRORS } from '@app/common/constants'
import { Status } from '@app/common/enums'
import { User } from '../users/contract/users.schema'
import { Track } from '../tracks/contract/track.schema'

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name)
    private playlistModel: Model<Playlist>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Track.name)
    private trackModel: Model<Track>
  ) {}

  async create(input: CreatePlaylistDto): Promise<Playlist> {
    try {
      // TODO: Remove User from DTO, take from Token /me
      const user = await this.userModel.findById(input.user).lean().exec()
      if (!user) throw new NotFoundException(`User not found`)
      const entity = new this.playlistModel({
        ...input,
        status: Status.ACTIVE
      })
      await entity.save()
      return entity.toObject()
    } catch (error) {
      if (error.code === MONGO_ERRORS.DUPLICATE_KEY) {
        throw new ConflictException('Playlist already exists')
      }
      throw error
    }
  }

  async update(input: UpdatePlaylistDto, playlistId: string): Promise<Playlist> {
    const user = await this.userModel.findById(input.user).lean().exec()
    if (!user) throw new NotFoundException(`User not found`)
    const entity = new this.playlistModel({
      ...input,
      status: Status.ACTIVE
    })
    const playlist = await this.findById(playlistId)
    await this.playlistModel.updateOne({ _id: playlist._id }, { ...input, status: Status.ACTIVE })
    return entity.toObject()
  }

  async addTrack(input: AddPlaylistTrackDto, userId: string): Promise<Playlist> {
    const [playlist, track] = await Promise.all([
      this.findById(input.playlist),
      this.trackModel.findById(input.track, 'durationMs').lean().exec()
    ])
    if (!track) throw new NotFoundException('Track not found')

    if (playlist.user._id.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to edit this playlist')
    }

    const updatedPlaylist = await this.playlistModel
      .findByIdAndUpdate(
        playlist._id,
        {
          $push: { tracks: track._id },
          $inc: {
            totalTracks: 1,
            totalDurationMs: track.durationMs
          }
        },
        { returnDocument: 'after' }
      )
      .exec()

    if (!updatedPlaylist) {
      throw new NotFoundException('Playlist was deleted before update')
    }

    return updatedPlaylist.toObject()
  }

  async findById(playlistId: string): Promise<Playlist> {
    const entity = await this.playlistModel.findById(playlistId).lean().exec()
    if (!entity) throw new NotFoundException(`Playlist not found`)
    return entity
  }

  async findAll() {
    return this.playlistModel.find().lean().exec()
  }
}
