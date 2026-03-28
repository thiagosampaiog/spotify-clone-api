import { IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator'

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  @IsUrl()
  imageUrl?: string
}

export class UpdatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  name?: string

  @IsString()
  @IsOptional()
  @IsUrl()
  imageUrl?: string
}

export class AddPlaylistTrackDto {
  @IsMongoId()
  @IsNotEmpty()
  track: string
}

// AddMultipleTracksDto..
