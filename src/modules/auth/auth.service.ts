import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../users/user.service'
import { Status } from '@app/common/types/enums'
import { CreateUserDto } from '../users/contract/user.dto'
import { userInfo } from 'os'
import { AuthLoginDto } from './dto/auth-login.dto'
import { HashingProvider } from '@app/infra/hashing/hashing.provider'
import { User } from '../users/contract/users.schema'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private hashingProvider: HashingProvider
  ) {}

  private async tokenGenerator(user: Omit<User, 'password'>) {
    const payload = { sub: user._id, email: user.email, role: user.role }
    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }

  public async signin(input: AuthLoginDto) {
    const { email, password } = input
    const user = await this.userService.findUser(email)
    if (!user) throw new UnauthorizedException('Invalid credentials')
    const isValidPassword = await this.hashingProvider.comparePassword(password, user.password)
    if (!isValidPassword) throw new UnauthorizedException('Invalid credentials')
    return this.tokenGenerator(user)
  }

  public async signup(input: CreateUserDto): Promise<any> {
    const user = await this.userService.create(input)
    return this.tokenGenerator(user)
  }
}
