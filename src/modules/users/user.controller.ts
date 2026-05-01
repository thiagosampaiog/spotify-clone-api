import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './contract/users.schema'
import { UpdateUserDto } from './contract/user.dto'
import { Roles } from '@app/common/decorators/role.decorator'
import { UserRole } from '@common/types/enums'
import { CurrentUser } from '@app/common/decorators/current-user.decorator'
import type { AuthenticatedUser } from '@common/types/jwt.constant'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // TODO: Public Profiles

  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll()
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findById(@Param('id') userId: string): Promise<User> {
    return this.userService.findById(userId)
  }

  @Patch('me')
  async update(@Body() input: UpdateUserDto, @CurrentUser() user: AuthenticatedUser): Promise<User> {
    const userId = user.sub
    return this.userService.update(input, userId)
  }

  @Delete('me')
  async delete(@CurrentUser() user: AuthenticatedUser): Promise<User> {
    const userId = user.sub
    return this.userService.delete(userId)
  }
}
