import { PartialType } from '@nestjs/swagger'
import { ArrayUnique, IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator'

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsMongoId()
  user: string

  @IsArray()
  @ArrayUnique()
  @IsMongoId()
  @IsOptional()
  tracks?: string[]

  @IsString()
  @IsOptional()
  @IsUrl()
  imageUrl?: string
}
export class UpdatePlaylistDto extends PartialType(CreatePlaylistDto) {}
