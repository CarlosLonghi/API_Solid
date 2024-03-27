import { type UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentials } from './errors/invalid-credentials'
import { compare } from 'bcryptjs'
import { type User } from '@prisma/client'

interface AuthenticateServiceRequest {
  email: string
  password: string
}

interface AuthenticateServiceResponse {
  user: User
}

export class AuthenticateService {
  constructor (
    private readonly usersRepository: UsersRepository
  ) {}

  async execute ({ email, password }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const user = await this.usersRepository.fyndByEmail(email)

    if (user === null) {
      throw new InvalidCredentials()
    }

    // Clean Code: Boolean variables need start with => "is", "has" or "does"
    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentials()
    }

    return {
      user
    }
  }
}
