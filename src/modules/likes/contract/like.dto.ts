import { LikesTargets } from '@app/common/enums'
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator'

export class ToggleLikeDto {

  @IsEnum(LikesTargets)
  @IsNotEmpty()
  targetType: LikesTargets

}
