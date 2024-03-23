import { type Prisma, type User } from '@prisma/client'

export interface UsersRepository {
  fyndByEmail: (email: string) => Promise<User | null>
  create: (data: Prisma.UserCreateInput) => Promise<User>
}
