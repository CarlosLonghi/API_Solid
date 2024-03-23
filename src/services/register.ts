import { type UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

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
      throw new Error('Email já cadastrado!')
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHashed
    })
  }
}
