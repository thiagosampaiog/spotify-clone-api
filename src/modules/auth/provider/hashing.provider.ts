import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class HashingProvider {
  abstract hashPassword(data: string | Buffer): Promise<String>

  abstract comparePassword(plainPassword: string | Buffer, hashedPassword: string | Buffer): Promise<boolean>
}
