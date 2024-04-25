import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsService } from './get-user-metrics'

// Unit Tests

let checkInsRepository: InMemoryCheckInsRepository
let getUserMetricService: GetUserMetricsService

describe('Get User Metrics Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    getUserMetricService = new GetUserMetricsService(checkInsRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01'
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01'
    })

    const { checkInsCount } = await getUserMetricService.execute({
      userId: 'user-01'
    })

    expect(checkInsCount).toEqual(2)
  })
})
