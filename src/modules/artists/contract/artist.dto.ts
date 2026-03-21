import { PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUrl, MinLength } from 'class-validator'

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  bio: string

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  imageUrl: string
}

export class UpdateArtistDto extends PartialType(CreateArtistDto) {}
