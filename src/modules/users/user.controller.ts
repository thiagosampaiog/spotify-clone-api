import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './contract/users.schema'
import { UpdateUserDto } from './contract/user.dto'
import { Roles } from '@app/common/decorators/role.decorator'
import { UserRole } from '@app/common/guards/types/enums'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // TODO: Public Profiles

  // PRIVATE
  @Roles(UserRole.DEFAULT, UserRole.ADMIN)
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll()
  }

  // PRIVATE, only admin or same userId
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findById(@Param('id') userId: string): Promise<User> {
    return this.userService.findById(userId)
  }

  // PRIVATE, only same userId - check if user can change role
  @Roles(UserRole.DEFAULT, UserRole.ADMIN)
  @Patch(':id')
  async update(@Body() input: UpdateUserDto, @Param('id') userId: string): Promise<User> {
    return this.userService.update(input, userId)
  }

  // PRIVATE, only admin or same userId
  @Roles(UserRole.DEFAULT, UserRole.ADMIN)
  @Delete(':id')
  async delete(@Param('id') userId: string): Promise<User> {
    return this.userService.delete(userId)
  }
}
