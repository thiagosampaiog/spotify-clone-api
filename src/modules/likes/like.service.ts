import { Injectable, NotFoundException } from '@nestjs/common'
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

  async toggleLike(input: ToggleLikeDto, targetId: string, userId: string) {
    // I can use an switch case here?
    // I need to be fast here, so I can just dont return document an use just deleteOne
    // I can use then? I need to verify if the item exists first
    if (input.targetType === LikesTargets.ALBUM) {
      const album = await this.albumModel.exists({ _id: targetId, ...ACTIVE_FILTER })
      if (!album) throw new NotFoundException('Album not found')
      const isLiked = await this.likeModel.exists({
        user: userId,
        targetId: targetId,
        targetType: input.targetType
      })
      if (isLiked) {
        await this.likeModel.findOneAndDelete(
          {
            user: userId,
            targetId: targetId,
            targetType: input.targetType
          },
          { returnDocument: 'after' }
        )
      } else {
        await this.likeModel
          .create({
            user: userId,
            targetId: targetId,
            targetType: input.targetType
          })
          .then((r) => r.save())
      }
    }
  }
}
