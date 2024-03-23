import { type UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExists } from './errors/user-already-exists'

interface RegisterServiceProps {
  name: string
  email: string
  password: string
}

export class RegisterService {
  constructor (
    private readonly usersRepository: UsersRepository
  ) {}

  async execute ({
    name, email, password
  }: RegisterServiceProps) {
    const passwordHashed = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.fyndByEmail(email)

    if (userWithSameEmail !== null) {
      throw new UserAlreadyExists()
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHashed
    })
  }
}
