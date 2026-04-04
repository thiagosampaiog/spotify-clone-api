import { Genres } from '@app/common/types/enums'
import { PartialType } from '@nestjs/swagger'
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl
} from 'class-validator'

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsUrl()
  @IsNotEmpty()
  imageUrl: string

  @IsMongoId()
  @IsNotEmpty()
  artist: string

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(Genres, { each: true })
  genres: Genres[]

  @IsDateString()
  @IsOptional()
  releasedAt?: string
}

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {}
