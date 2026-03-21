import { PartialType } from '@nestjs/swagger'
import { ArrayNotEmpty, ArrayUnique, IsArray, IsMongoId, IsNotEmpty, IsString, IsUrl } from 'class-validator'

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsUrl()
  @IsNotEmpty()
  audioUrl: string

  @IsMongoId()
  @IsNotEmpty()
  album: string

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsMongoId({ each: true })
  artists: string[]
}

export class UpdateTrackDto extends PartialType(CreateTrackDto) {}
