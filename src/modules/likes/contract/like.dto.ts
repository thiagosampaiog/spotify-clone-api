import { LikesTargets } from '@app/common/enums'
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator'

export class ToggleLikeDto {
  @IsMongoId()
  user: string

  @IsEnum(LikesTargets)
  @IsNotEmpty()
  targetType: LikesTargets

  @IsMongoId()
  target: string
}
