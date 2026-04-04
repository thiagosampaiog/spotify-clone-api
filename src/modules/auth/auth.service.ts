import { ConflictException, forwardRef, Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../users/user.service'
import { Status } from '@app/common/enums'
import { CreateUserDto } from '../users/contract/user.dto'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  public async signup(input: CreateUserDto): Promise<any> {
    const user = await this.userService.create(input);
    
  }
}
