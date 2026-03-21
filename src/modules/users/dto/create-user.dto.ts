import { isNotEmpty, IsNotEmpty, IsString, IsUrl, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  imageUrl: string
}
