import { UserRole } from './enums'

export type AuthenticatedUser = {
  sub: string
  name: string
  email: string
  role: UserRole
}
