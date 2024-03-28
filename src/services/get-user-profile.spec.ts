import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileService } from './get-user-profile'
import { ResourceNotFound } from './errors/resource-not-found'

// Unit Tests

let usersRepository: InMemoryUsersRepository
let getUserProfileService: GetUserProfileService

describe('Get User Profile Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    getUserProfileService = new GetUserProfileService(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'Nome Teste',
      email: 'teste@exemplo.com',
      password_hash: await hash('123456', 6)
    })

    const { user } = await getUserProfileService.execute({
      userId: createdUser.id
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('Nome Teste')
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(
      getUserProfileService.execute({
        userId: 'non-existing-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
