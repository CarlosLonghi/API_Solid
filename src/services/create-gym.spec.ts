import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymService } from './create-gym'

// Unit Tests

let gymsRepository: InMemoryGymsRepository
let createGymService: CreateGymService

describe('Create Gym Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    createGymService = new CreateGymService(gymsRepository)
  })

  it('should be able to create Gym', async () => {
    const { gym } = await createGymService.execute({
      title: 'Fit Gym',
      description: null,
      phone: null,
      latitude: -23.6829801,
      longitude: -52.62905
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
