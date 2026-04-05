import { Body, Controller, Inject, Param, Post } from '@nestjs/common'
import { LikeService } from './like.service'
import { ToggleLikeDto } from './contract/like.dto'
import { CurrentUser } from '@app/common/decorators/current-user.decorator'
import type { AuthenticatedUser } from '@app/common/guards/types/jwt.constant'

@Controller('likes')
export class LikeController {
  constructor(
    @Inject()
    private likeService: LikeService
  ) {}

  @Post(':id')
  async toggleLike(
    @Body() input: ToggleLikeDto,
    @Param('id') targetId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    const userId = user.sub
    return this.likeService.toggleLike(input, targetId, userId)
  }
}
