import { type User, type Prisma } from '@prisma/client'
import { type UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create (data: Prisma.UserCreateInput) {
    const user = {
      id: 'user-1',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
      updated_at: new Date()
    }

    this.items.push(user)
    return user
  }

  async fyndByEmail (email: string) {
    const user = this.items.find((item) => item.email === email)

    if (user === undefined) {
      return null
    }

    return user
  }
}
