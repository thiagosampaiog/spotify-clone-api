import { PartialType } from '@nestjs/swagger'
import { IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator'

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsMongoId()
  user: string

  @IsString()
  @IsOptional()
  @IsUrl()
  imageUrl?: string
}

export class UpdatePlaylistDto extends PartialType(CreatePlaylistDto) {}

export class AddPlaylistTrackDto {
  @IsMongoId()
  @IsNotEmpty()
  track: string

  @IsMongoId()
  @IsNotEmpty()
  playlist: string
}

// AddMultipleTracksDto..
