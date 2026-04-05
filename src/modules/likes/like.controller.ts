import { Body, Controller, Inject, Param, Post, UseGuards } from '@nestjs/common'
import { LikeService } from './like.service'
import { ToggleLikeDto } from './contract/like.dto'
import { CurrentUser } from '@app/common/decorators/current-user.decorator'
import type { AuthenticatedUser } from '@app/common/guards/types/jwt.constant'
import { AuthGuard } from '@app/common/guards/auth.guard'

@UseGuards(AuthGuard)
@Controller('likes')
export class LikeController {
  constructor(
    @Inject()
    private likeService: LikeService
  ) {}

  @Post(':targetId/users/me')
  async toggleLike(
    @Body() input: ToggleLikeDto,
    @Param('targetId') targetId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    const userId = user.sub
    return this.likeService.toggleLike(input, targetId, userId)
  }
}
