import { Body, Controller, Inject, Param, Post } from '@nestjs/common'
import { LikeService } from './like.service'
import { ToggleLikeDto } from './contract/like.dto'

@Controller('likes')
export class LikeController {
  constructor(
    @Inject()
    private likeService: LikeService
  ) {}

  @Post(':targetId/users/:userId')
  async toggleLike(
    @Body() input: ToggleLikeDto,
    @Param('targetId') targetId: string,
    @Param('userId') userId: string
  ) {
    return this.likeService.toggleLike(input, targetId, userId)
  }
}
