import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './contract/users.schema'
import { Model } from 'mongoose'
import { CreateUserDto, UpdateUserDto } from './contract/user.dto'
import { MONGO_ERRORS } from '@app/common/constants'
import { Status } from '@app/common/enums'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {}
  async findById(userId: string): Promise<User> {
    const found = await this.userModel.findById(userId).lean().exec()
    if (!found) throw new NotFoundException(`User ${userId} not found`)
    return found
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().lean().exec()
  }

  async create(input: CreateUserDto): Promise<User> {
    try {
      const entity = new this.userModel({ ...input, status: Status.ACTIVE })
      await entity.save()
      return entity.toObject()
    } catch (error) {
      if (error.code === MONGO_ERRORS.DUPLICATE_KEY) {
        throw new ConflictException('User already exists')
      }
      throw error
    }
  }

  async update(input: UpdateUserDto, userId: string): Promise<User> {
    const updated = await this.userModel
      .findOneAndUpdate({ _id: userId }, { $set: input }, { returnDocument: 'after' })
      .lean()
      .exec()

    if (!updated) throw new NotFoundException(`User ${userId} not found`)

    return updated
  }

  async delete(userId: string): Promise<void> {
    const deleted = await this.userModel.findByIdAndDelete(userId).exec()
    if (!deleted) throw new NotFoundException(`User ${userId} not found`)
  }
}
