import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthLoginDto } from './dto/auth-login.dto'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { Public } from '@app/common/decorators/public.decorator'
import { CreateUserDto } from '../users/contract/user.dto'
import { CurrentUser } from '@app/common/decorators/current-user.decorator'
import type { AuthenticatedUser } from '@app/common/types/jwt.constant'

@UseGuards(AuthGuard)
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

  @Get('me')
  async me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.me(user)
  }
}
