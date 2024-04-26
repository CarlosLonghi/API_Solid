import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsService } from './search-gyms'

// Unit Tests

let gymsRepository: InMemoryGymsRepository
let searchGymsService: SearchGymsService

describe('Search Gyms Service', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    searchGymsService = new SearchGymsService(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'gym-01',
      description: null,
      phone: '',
      latitude: -23.6829801,
      longitude: -52.62905
    })

    await gymsRepository.create({
      title: 'gym-02',
      description: null,
      phone: '',
      latitude: -23.6829801,
      longitude: -52.62905
    })

    const { gyms } = await searchGymsService.execute({
      query: 'gym-01',
      page: 1
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gym-01' })
    ])
  })
})
