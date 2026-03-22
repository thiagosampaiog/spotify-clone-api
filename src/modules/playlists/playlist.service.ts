import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Playlist } from './contract/playlist.schema'
import { CreatePlaylistDto } from './contract/playlist.dto'
import { MONGO_ERRORS } from '@app/common/constants'
import { Status } from '@app/common/enums'

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name)
    private playlistModel: Model<Playlist>
  ) {}

  async create(input: CreatePlaylistDto): Promise<Playlist> {
    try {
      // playlist has to have tracks
      // check user valid if without jwt isn't it?
      // check tracks ids if any doesn't exist throw error not found
      // playlist has to have userId from jwt ? or I cant just add from params
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

  async findById(playlistId: string): Promise<Playlist> {
    const entity = await this.playlistModel.findById(playlistId)
    if (!entity) throw new NotFoundException(`Playlist ${playlistId} not found`)
    return entity
  }

  async findAll() {
    return this.playlistModel.find()
  }
}
