import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentials } from './errors/invalid-credentials'

// Unit Tests

let usersRepository: InMemoryUsersRepository
let authenticateService: AuthenticateService

describe('Authenticate Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateService = new AuthenticateService(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'Nome Teste',
      email: 'teste@exemplo.com',
      password_hash: await hash('123456', 6)
    })

    const { user } = await authenticateService.execute({
      email: 'teste@exemplo.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be able to authenticate', async () => {
    await expect(
      authenticateService.execute({
        email: 'teste@exemplo.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentials)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Nome Teste',
      email: 'teste@exemplo.com',
      password_hash: await hash('123456', 6)
    })

    await expect(
      authenticateService.execute({
        email: 'teste@exemplo.com',
        password: '123123'
      })
    ).rejects.toBeInstanceOf(InvalidCredentials)
  })
})
