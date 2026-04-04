import { Injectable } from '@nestjs/common'
import { HashingProvider } from './hashing.provider'

@Injectable()
export class BcryptProvider implements HashingProvider {
  async comparePassword(plainPassword: string | Buffer, hashedPassword: string | Buffer): Promise<boolean> {}

  async hashPassword(data: string | Buffer): Promise<String> {}
}
