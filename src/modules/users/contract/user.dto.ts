import { PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUrl } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  imageUrl: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
