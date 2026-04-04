import { PartialType } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, IsUrl } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  @IsStrongPassword()
  password: string

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  imageUrl: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
