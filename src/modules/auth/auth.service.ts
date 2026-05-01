import { Body, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../users/user.service'
import { CreateUserDto } from '../users/contract/user.dto'
import { AuthLoginDto } from './dto/auth-login.dto'
import { HashingProvider } from '@app/infra/hashing/hashing.provider'
import { User } from '../users/contract/users.schema'
import { AuthenticatedUser } from '@common/types/jwt.constant'
import authConfig from '@app/infra/config/auth.config'
import type { ConfigType } from '@nestjs/config'
import { Status } from '@common/types/enums'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    private readonly userService: UserService,

    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,

    private readonly hashingProvider: HashingProvider
  ) {}

  public async signin(input: AuthLoginDto) {
    const { email, password } = input

    const user = await this.userService.findUserForLogin(email)

    if (!user) throw new UnauthorizedException('Invalid credentials')
    if (user.status === Status.BANNED || user.status === Status.DELETED)
      throw new UnauthorizedException('Invalid credentials')

    const isValidPassword = await this.hashingProvider.comparePassword(password, user.password)

    if (!isValidPassword) throw new UnauthorizedException('Invalid credentials')

    return this.generateToken(user)
  }

  public async signup(input: CreateUserDto): Promise<any> {
    return await this.userService.create(input)
  }

  public async refreshToken(input: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync(input.refreshToken, {
        secret: this.authConfiguration.secret,
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer
      })

      const user = await this.userService.findById(sub)

      return await this.generateToken(user)
    } catch (error) {
      throw new UnauthorizedException(error)
    }
  }

  public async me(user: AuthenticatedUser) {
    return this.userService.findUser(user.email)
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload
      },
      {
        secret: this.authConfiguration.secret,
        issuer: this.authConfiguration.issuer,
        audience: this.authConfiguration.audience,
        expiresIn: expiresIn
      }
    )
  }

  private async generateToken(user: User) {
    const userId = user._id.toString()
    const payload = { email: user.email, name: user.name, role: user.role }
    const accessToken = await this.signToken(userId, this.authConfiguration.expiresIn, payload)
    const refreshToken = await this.signToken(userId, this.authConfiguration.refreshTokenExpiresIn, payload)
    return { access_token: accessToken, refreshToken }
  }
}
