import { expect, describe, it } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'

// Unit Tests

describe('Register Service', () => {
  it('should hash user password upon registration', async () => {
    const registerService = new RegisterService({
      async create (data) {
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
          updated_at: new Date()
        }
      },

      async fyndByEmail (email) {
        return null
      }
    })

    const { user } = await registerService.execute({
      name: 'Ciclano',
      email: 'ciclano@gmail.com',
      password: '123456'
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
