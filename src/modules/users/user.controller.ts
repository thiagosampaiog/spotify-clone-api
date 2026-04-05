import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './contract/users.schema'
import { UpdateUserDto } from './contract/user.dto'
import { Roles } from '@app/common/decorators/role.decorator'
import { UserRole } from '@app/common/guards/types/enums'
import { CurrentUser } from '@app/common/decorators/current-user.decorator'
import type { AuthenticatedUser } from '@app/common/guards/types/jwt.constant'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // TODO: Public Profiles

  @Roles(UserRole.DEFAULT, UserRole.ADMIN)
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll()
  }

  @Roles(UserRole.ADMIN, UserRole.DEFAULT)
  @Get(':id')
  async findById(@Param('id') userId: string): Promise<User> {
    return this.userService.findById(userId)
  }

  @Roles(UserRole.DEFAULT, UserRole.ADMIN)
  @Patch('me')
  async update(@Body() input: UpdateUserDto, @CurrentUser() user: AuthenticatedUser): Promise<User> {
    const userId = user.sub
    return this.userService.update(input, userId)
  }

  @Roles(UserRole.DEFAULT, UserRole.ADMIN)
  @Delete('me')
  async delete(@CurrentUser() user: AuthenticatedUser): Promise<User> {
    const userId = user.sub
    return this.userService.delete(userId)
  }
}
