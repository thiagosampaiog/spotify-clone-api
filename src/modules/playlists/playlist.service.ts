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

  async update(input: UpdatePlaylistDto, playlistId: string, userId: string): Promise<Playlist> {
    const updated = await this.playlistModel
      .findOneAndUpdate(
        { _id: playlistId, user: userId, status: { $nin: [Status.BANNED, Status.DELETED] } },
        {
          $set: { name: input.name, imageUrl: input.imageUrl }
        },
        { returnDocument: 'after' }
      )
      .exec()
    if (!updated) throw new NotFoundException('Playlist not found')
    return updated
  }

  async addTrack(input: AddPlaylistTrackDto, playlistId: string, userId: string): Promise<Playlist> {
    const [playlist, track] = await Promise.all([
      this.findById(playlistId),
      this.trackModel
        .findOne({ _id: input.track, status: { $nin: [Status.BANNED, Status.DELETED] } }, 'durationMs')
        .lean()
        .exec()
    ])
    if (!track) throw new NotFoundException('Track not found')

    if (playlist.user.toString() !== userId) {
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
    const entity = await this.playlistModel
      .findOne({ _id: playlistId, status: { $nin: [Status.BANNED, Status.DELETED] } })
      .lean()
      .exec()
    if (!entity) throw new NotFoundException(`Playlist not found`)
    return entity
  }

  async findAll(userId: string) {
    return this.playlistModel
      .find({
        user: userId,
        status: { $nin: [Status.BANNED, Status.DELETED] }
      })
      .lean()
      .exec()
  }

  async delete(playlistId: string, userId: string) {
    const deleted = await this.playlistModel
      .findOneAndUpdate(
        { _id: playlistId, user: userId, status: { $ne: Status.DELETED } },
        { status: Status.DELETED, deletedAt: new Date() },
        { returnDocument: 'after' }
      )
      .exec()

    if (!deleted) {
      throw new NotFoundException('Playlist not found, already deleted, or you do not own it')
    }

    return deleted
  }
}
