import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Playlist } from './contract/playlist.schema'
import { CreatePlaylistDto } from './contract/playlist.dto'
import { MONGO_ERRORS } from '@app/common/constants'
import { Status } from '@app/common/enums'
import { User } from '../users/contract/users.schema'

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name)
    private playlistModel: Model<Playlist>,
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {}

  async create(input: CreatePlaylistDto): Promise<Playlist> {
    try {
      // TODO: Remove User from DTO, take from Token /me
      // check if dto has tracks ids, if any doesn't exist throw error not found
      // sum each track duration
      // should I create an endpoint for add track to playlist? and remove tracks from here ?
      const user = await this.userModel.findById(input.user)
      if (!user) throw new NotFoundException(`User ${input.user} not found`)
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
