import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExists } from './errors/user-already-exists'

// Unit Tests

let usersRepository: InMemoryUsersRepository
let registerService: RegisterService

describe('Register Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    registerService = new RegisterService(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await registerService.execute({
      name: 'Nome Teste',
      email: 'teste@exemplo.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await registerService.execute({
      name: 'Nome Teste',
      email: 'teste@exemplo.com',
      password: '123456'
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'teste@exemplo.com'

    await registerService.execute({
      name: 'Nome Teste',
      email,
      password: '123456'
    })

    await expect(
      registerService.execute({
        name: 'Nome Teste',
        email,
        password: '123456'
      })
    ).rejects.toBeInstanceOf(UserAlreadyExists)
  })
})
