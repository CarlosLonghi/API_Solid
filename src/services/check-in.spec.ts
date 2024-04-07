import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInService } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

// Unit Tests

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInService: CheckInService

describe('Check-in Service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()

    checkInService = new CheckInService(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'Fit Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-23.6829801),
      longitude: new Decimal(-52.62905)
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check-in', async () => {
    vi.setSystemTime(new Date(2024, 0, 18, 0, 0, 0))

    const { checkIn } = await checkInService.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.6829801,
      userLongitude: -52.62905
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check-in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 18, 6, 0, 0))

    await checkInService.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.6829801,
      userLongitude: -52.62905
    })

    await expect(async () => await checkInService.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.6829801,
      userLongitude: -52.62905
    })).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check-in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 18, 6, 0, 0))

    await checkInService.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.6829801,
      userLongitude: -52.62905
    })

    vi.setSystemTime(new Date(2024, 0, 19, 6, 0, 0))

    const { checkIn } = await checkInService.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.6829801,
      userLongitude: -52.62905
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check-in on distant gym', async () => {
    vi.setSystemTime(new Date(2024, 0, 18, 0, 0, 0))

    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Fit Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-23.5966649),
      longitude: new Decimal(-52.5190246)
    })

    await expect(
      checkInService.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -23.6829801,
        userLongitude: -52.62905
      })
    ).rejects.toBeInstanceOf(Error)
  })
})
