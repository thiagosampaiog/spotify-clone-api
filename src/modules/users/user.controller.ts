import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './contract/users.schema'
import { CreateUserDto, UpdateUserDto } from './contract/user.dto'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll()
  }

  @Get(':id')
  async findById(@Param('id') userId: string): Promise<User> {
    return this.userService.findById(userId)
  }

  @Post()
  async create(@Body() input: CreateUserDto): Promise<User> {
    return this.userService.create(input)
  }

  @Patch(':id')
  async update(@Body() input: UpdateUserDto, @Param('id') userId: string): Promise<User> {
    return this.userService.update(input, userId)
  }

  @Delete(':id')
  async delete(@Param('id') userId: string): Promise<void> {
    return this.userService.delete(userId)
  }
}
