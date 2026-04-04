import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './contract/users.schema'
import { Model } from 'mongoose'
import { CreateUserDto, UpdateUserDto } from './contract/user.dto'
import { ACTIVE_FILTER, MONGO_ERRORS, USER_DETAIL_SELECT, USER_LITE_SELECT } from '@app/common/constants'
import { Status } from '@app/common/enums'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {}
  async findById(userId: string): Promise<User> {
    const found = await this.userModel
      .findOne({ _id: userId, ...ACTIVE_FILTER })
      .select(USER_DETAIL_SELECT)
      .lean()
      .exec()
    if (!found) throw new NotFoundException(`User not found`)
    return found
  }

  async findAll(): Promise<User[]> {
    return this.userModel
      .find({ ...ACTIVE_FILTER })
      .select(USER_LITE_SELECT)
      .lean()
      .exec()
  }

  async findUser(email: string) {
    return this.userModel
      .findOne({ email: email, ...ACTIVE_FILTER })
      .lean()
      .exec()
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
      .findOneAndUpdate({ _id: userId, ...ACTIVE_FILTER }, { $set: input }, { returnDocument: 'after' })
      .lean()
      .exec()

    if (!updated) throw new NotFoundException(`User not found`)

    return updated
  }

  async delete(userId: string): Promise<User> {
    const deleted = await this.userModel
      .findOneAndUpdate(
        {
          _id: userId,
          ...ACTIVE_FILTER
        },
        {
          $set: { status: Status.DELETED, deletedAt: new Date() }
        },
        {
          returnDocument: 'after'
        }
      )
      .exec()
    if (!deleted) throw new NotFoundException(`User not found`)
    return deleted
  }
}
