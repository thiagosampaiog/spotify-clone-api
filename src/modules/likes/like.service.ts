import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Like } from './contract/like.schema'
import { Model } from 'mongoose'
import { ToggleLikeDto } from './contract/like.dto'
import { LikesTargets } from '@app/common/enums'
import { Album } from '../albums/contract/album.schema'
import { Track } from '../tracks/contract/track.schema'
import { Playlist } from '../playlists/contract/playlist.schema'
import { ACTIVE_FILTER } from '@app/common/constants'

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name)
    private likeModel: Model<Like>,
    @InjectModel(Album.name)
    private albumModel: Model<Album>,
    @InjectModel(Track.name)
    private trackModel: Model<Track>,
    @InjectModel(Playlist.name)
    private playlistModel: Model<Playlist>
  ) {}

  // TODO: Add a few focused tests for toggle idempotency, not found, and duplicates
  async toggleLike(input: ToggleLikeDto, targetId: string, userId: string) {
    const modelType: Record<LikesTargets, Model<any>> = {
      [LikesTargets.ALBUM]: this.albumModel,
      [LikesTargets.TRACK]: this.trackModel,
      [LikesTargets.PLAYLIST]: this.playlistModel
    }

    const target = modelType[input.targetType]

    let playlist: Playlist | null = null

    if (input.targetType === LikesTargets.PLAYLIST) {
      playlist = await target.findOne({ _id: targetId, ...ACTIVE_FILTER })
      if (!playlist) throw new NotFoundException('Playlist not found')
      if (!playlist.isPublic && !playlist.user.equals(userId)) throw new ForbiddenException('Playlist is private')
    } else {
      const exists = await target.exists({ _id: targetId, ...ACTIVE_FILTER })
      if (!exists) throw new NotFoundException(`${input.targetType} not found`)
    }

    const data = {
      user: userId,
      targetId: targetId,
      targetType: input.targetType
    }

    const isLiked = await this.likeModel.exists(data)
    if (isLiked) {
      await this.likeModel.findOneAndDelete(data)
      return { liked: false }
    } else {
      await this.likeModel.create(data)
      return { liked: true }
    }
  }

  // TODO: Find My Songs Liked
}
