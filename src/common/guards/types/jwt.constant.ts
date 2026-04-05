import { UserRole } from './enums'

export interface AuthenticatedUser {
  sub: string
  name: string
  email: string
  role: UserRole
}
