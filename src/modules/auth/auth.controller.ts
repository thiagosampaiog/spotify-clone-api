import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthLoginDto } from './dto/auth-login.dto'
import { Public } from '@common/decorators/public.decorator'
import { CreateUserDto } from '../users/contract/user.dto'
import { CurrentUser } from '@common/decorators/current-user.decorator'
import type { AuthenticatedUser } from '@common/types/jwt.constant'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signin(@Body() input: AuthLoginDto) {
    return this.authService.signin(input)
  }

  @Public()
  @Post('register')
  async signup(@Body() input: CreateUserDto) {
    return this.authService.signup(input)
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  public async refreshToken(@Body() input: RefreshTokenDto) {
    return this.authService.refreshToken(input)
  }

  @Get('me')
  async me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.me(user)
  }
}
