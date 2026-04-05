import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Playlist } from './contract/playlist.schema'
import { AddPlaylistTrackDto, CreatePlaylistDto, UpdatePlaylistDto } from './contract/playlist.dto'
import {
  ACTIVE_FILTER,
  MONGO_ERRORS,
  PLAYLIST_DETAIL_SELECT,
  PLAYLIST_LITE_SELECT,
  TRACK_DETAIL_SELECT,
  TRACK_LITE_SELECT,
  USER_DETAIL_SELECT,
  USER_LITE_SELECT
} from '@app/common/guards/types/constants'
import { Status } from '@app/common/guards/types/enums'
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

  async create(input: CreatePlaylistDto, userId: string): Promise<Playlist> {
    try {
      const user = await this.userModel.findById(userId).lean().exec()
      if (!user) throw new NotFoundException(`User not found`)
      const entity = new this.playlistModel({
        ...input,
        isPublic: true,
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
        { _id: playlistId, user: userId, ...ACTIVE_FILTER },
        {
          $set: { name: input.name, imageUrl: input.imageUrl, isPublic: input.isPublic }
        },
        { returnDocument: 'after' }
      )
      .exec()
    if (!updated) throw new NotFoundException('Playlist not found')
    return updated.toObject()
  }

  async addTrack(input: AddPlaylistTrackDto, playlistId: string, userId: string): Promise<Playlist> {
    const [playlist, track] = await Promise.all([
      this.findOneMyPlaylist(playlistId, userId),
      this.trackModel
        .findOne({ _id: input.track, ...ACTIVE_FILTER }, 'durationMs')
        .lean()
        .exec()
    ])
    if (!track) throw new NotFoundException('Track not found')

    const updatedPlaylist = await this.playlistModel
      .findByIdAndUpdate(
        playlist._id,
        {
          $push: { tracks: { track: track._id, addedAt: new Date() } },
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

  async removeTrack(playlistId: string, userId: string, entryId: string) {
    const playlist = await this.playlistModel
      .findOne({
        _id: playlistId,
        user: userId,
        ...ACTIVE_FILTER
      })
      .lean()
      .exec()

    if (!playlist) throw new NotFoundException('Playlist not found')

    const entry = playlist.tracks.find((t) => t._id.toString() === entryId)

    if (!entry) throw new NotFoundException('Entry not found')

    const track = await this.trackModel
      .findOne({
        _id: entry.track,
        ...ACTIVE_FILTER
      })
      .select('durationMs')
      .lean()
      .exec()

    if (!track) throw new NotFoundException('Track not found')

    const updated = await this.playlistModel
      .findOneAndUpdate(
        {
          _id: playlistId,
          user: userId,
          ...ACTIVE_FILTER
        },
        {
          $inc: { totalDurationMs: -track.durationMs, totalTracks: -1 },
          $pull: { tracks: { _id: entryId } }
        },
        {
          returnDocument: 'after'
        }
      )
      .exec()

    if (!updated) throw new NotFoundException('Playlist not found')

    return updated.toObject()
  }

  async findOneMyPlaylist(playlistId: string, userId: string): Promise<Playlist> {
    const entity = await this.playlistModel
      .findOne({ _id: playlistId, user: userId, ...ACTIVE_FILTER })
      .select(PLAYLIST_DETAIL_SELECT)
      .populate([
        { path: 'tracks.track', select: TRACK_DETAIL_SELECT, match: ACTIVE_FILTER },
        { path: 'user', select: USER_DETAIL_SELECT, match: ACTIVE_FILTER }
      ])
      .lean()
      .exec()
    if (!entity) throw new NotFoundException(`Playlist not found`)
    return entity
  }

  async findAllMyPlaylists(userId: string) {
    return this.playlistModel
      .find({
        user: userId,
        ...ACTIVE_FILTER
      })
      .select(PLAYLIST_LITE_SELECT)
      .populate([
        { path: 'tracks.track', select: TRACK_LITE_SELECT, match: ACTIVE_FILTER },
        { path: 'user', select: USER_LITE_SELECT, match: ACTIVE_FILTER }
      ])
      .lean()
      .exec()
  }

  async findAllPublic() {
    return this.playlistModel
      .find({ ...ACTIVE_FILTER, isPublic: true })
      .select(PLAYLIST_LITE_SELECT)
      .populate([
        { path: 'tracks.track', select: TRACK_LITE_SELECT, match: ACTIVE_FILTER },
        { path: 'user', select: USER_LITE_SELECT, match: ACTIVE_FILTER }
      ])
      .lean()
      .exec()
  }

  async findOnePublic(playlistId: string) {
    const entity = await this.playlistModel
      .findOne({ _id: playlistId, ...ACTIVE_FILTER, isPublic: true })
      .select(PLAYLIST_DETAIL_SELECT)
      .populate([
        { path: 'tracks.track', select: TRACK_DETAIL_SELECT, match: ACTIVE_FILTER },
        { path: 'user', select: USER_DETAIL_SELECT, match: ACTIVE_FILTER }
      ])
      .lean()
      .exec()

    if (!entity) throw new NotFoundException('Playlist not found')
    return entity
  }

  async delete(playlistId: string, userId: string) {
    const deleted = await this.playlistModel
      .findOneAndUpdate(
        { _id: playlistId, user: userId, ...ACTIVE_FILTER },
        { status: Status.DELETED, deletedAt: new Date() },
        { returnDocument: 'after' }
      )
      .exec()

    if (!deleted) {
      throw new NotFoundException('Playlist not found, already deleted, or you do not own it')
    }

    return deleted.toObject()
  }
}
