import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryService } from './fetch-user-check-ins-history'

// Unit Tests

let checkInsRepository: InMemoryCheckInsRepository
let fetchUserCheckInsHistoryService: FetchUserCheckInsHistoryService

describe('Fetch User Check-in History Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    fetchUserCheckInsHistoryService = new FetchUserCheckInsHistoryService(checkInsRepository)
  })

  it('should be able to fetch check-ins history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01'
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01'
    })

    const { checkIns } = await fetchUserCheckInsHistoryService.execute({
      userId: 'user-01'
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' })
    ])
  })
})
