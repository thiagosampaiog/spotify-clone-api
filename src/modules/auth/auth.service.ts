import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../users/user.service'
import { CreateUserDto } from '../users/contract/user.dto'
import { AuthLoginDto } from './dto/auth-login.dto'
import { HashingProvider } from '@app/infra/hashing/hashing.provider'
import { User } from '../users/contract/users.schema'
import { AuthenticatedUser } from '@app/common/guards/types/jwt.constant'
import authConfig from '@app/infra/config/auth.config'
import type { ConfigType } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    private readonly userService: UserService,

    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,

    private readonly hashingProvider: HashingProvider
  ) {}

  private async tokenGenerator(user: Omit<User, 'password'>) {
    const payload = { sub: user._id, name: user.name, email: user.email, role: user.role }
    return {
      access_token: await this.jwtService.signAsync(payload, this.authConfiguration)
    }
  }

  public async signin(input: AuthLoginDto) {
    const { email, password } = input
    const user = await this.userService.findUserForLogin(email)
    if (!user) throw new UnauthorizedException('Invalid credentials')
    const isValidPassword = await this.hashingProvider.comparePassword(password, user.password)
    if (!isValidPassword) throw new UnauthorizedException('Invalid credentials')
    return this.tokenGenerator(user)
  }

  public async signup(input: CreateUserDto): Promise<any> {
    const user = await this.userService.create(input)
    return this.tokenGenerator(user)
  }

  public async me(user: AuthenticatedUser) {
    return this.userService.findUser(user.email)
  }
}
