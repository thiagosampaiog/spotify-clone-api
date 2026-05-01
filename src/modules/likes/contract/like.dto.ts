import { LikesTargets } from '@common/types/enums'
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator'

export class ToggleLikeDto {
  @IsEnum(LikesTargets)
  @IsNotEmpty()
  targetType: LikesTargets
}
