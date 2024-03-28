import { type UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExists } from './errors/user-already-exists'
import { type User } from '@prisma/client'

interface RegisterServiceProps {
  name: string
  email: string
  password: string
}

interface RegisterServiceResponse {
  user: User
}

export class RegisterService {
  constructor (
    private readonly usersRepository: UsersRepository
  ) {}

  async execute ({
    name, email, password
  }: RegisterServiceProps): Promise<RegisterServiceResponse> {
    const passwordHashed = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail !== null) {
      throw new UserAlreadyExists()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHashed
    })

    return {
      user
    }
  }
}
