import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { ValidateCheckInService } from './validate-check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ResourceNotFound } from './errors/resource-not-found'

// Unit Tests

let checkInsRepository: InMemoryCheckInsRepository
let validateCheckInService: ValidateCheckInService

describe('Validate Check-in Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    validateCheckInService = new ValidateCheckInService(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01'
    })

    const { checkIn } = await validateCheckInService.execute({
      checkInId: createdCheckIn.id
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(
      validateCheckInService.execute({
        checkInId: 'inexistent-check-in-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 10, 30))

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01'
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21
    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(
      validateCheckInService.execute({
        checkInId: createdCheckIn.id
      })
    ).rejects.toBeInstanceOf(Error)
  })
})
