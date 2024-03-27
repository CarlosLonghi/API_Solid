import { expect, describe, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentials } from './errors/invalid-credentials'

// Unit Tests

describe('Authenticate Service', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateService = new AuthenticateService(usersRepository)

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
    const usersRepository = new InMemoryUsersRepository()
    const authenticateService = new AuthenticateService(usersRepository)

    await expect(
      authenticateService.execute({
        email: 'teste@exemplo.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentials)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateService = new AuthenticateService(usersRepository)

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
