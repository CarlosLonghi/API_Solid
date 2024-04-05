import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInService } from './check-in'

// Unit Tests

let checkInsRepository: InMemoryCheckInsRepository
let checkInService: CheckInService

describe('Check-in Service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    checkInService = new CheckInService(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check-in', async () => {
    vi.setSystemTime(new Date(2024, 0, 18, 0, 0, 0))

    const { checkIn } = await checkInService.execute({
      gymId: 'gym-01',
      userId: 'user-01'
    })

    console.log(checkIn.created_at)

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check-in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 18, 6, 0, 0))

    await checkInService.execute({
      gymId: 'gym-01',
      userId: 'user-01'
    })

    await expect(async () => await checkInService.execute({
      gymId: 'gym-01',
      userId: 'user-01'
    })).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check-in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 18, 6, 0, 0))

    await checkInService.execute({
      gymId: 'gym-01',
      userId: 'user-01'
    })

    vi.setSystemTime(new Date(2024, 0, 19, 6, 0, 0))

    const { checkIn } = await checkInService.execute({
      gymId: 'gym-01',
      userId: 'user-01'
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
