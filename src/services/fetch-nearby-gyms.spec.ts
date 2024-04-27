import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsService } from './fetch-nearby-gyms'

// Unit Tests

let gymsRepository: InMemoryGymsRepository
let fetchNearbyGymsService: FetchNearbyGymsService

describe('Search Gyms Service', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    fetchNearbyGymsService = new FetchNearbyGymsService(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: '',
      latitude: -23.6829801,
      longitude: -52.62905
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: '',
      latitude: -23.4725391,
      longitude: -52.5521192
    })

    const { gyms } = await fetchNearbyGymsService.execute({
      userLatitude: -23.6829801,
      userLongitude: -52.62905
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym' })
    ])
  })
})
