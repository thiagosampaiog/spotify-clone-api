import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './contract/users.schema'
import { Model } from 'mongoose'
import { CreateUserDto, UpdateUserDto } from './contract/user.dto'
import { ACTIVE_FILTER, USER_DETAIL_SELECT, USER_LITE_SELECT } from '@common/types/constants'
import { Status } from '@common/types/enums'
import { HashingProvider } from '../../infra/hashing/hashing.provider'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private hashingProvider: HashingProvider
  ) {}

  // test without sanitize
  private sanitize(user: User): Omit<User, 'password'> {
    const { password, ...rest } = user
    return rest
  }

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
      .select('-password')
      .lean()
      .exec()
  }

  async findUserForLogin(email: string) {
    return this.userModel
      .findOne({ email: email, ...ACTIVE_FILTER })
      .select('+password name email _id role')
      .lean()
      .exec()
  }

  async create(input: CreateUserDto): Promise<Omit<User, 'password'>> {
    const exists = await this.userModel.exists({ email: input.email })

    if (exists) throw new ConflictException('This email address is already in use')

    const user = new this.userModel({
      ...input,
      password: await this.hashingProvider.hashPassword(input.password),
      status: Status.ACTIVE
    })

    const saved = await user.save()

    return this.sanitize(saved)
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
