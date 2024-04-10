import { type CheckIn } from '@prisma/client'
import { type CheckInsRepository } from '@/repositories/check-ins-repository'
import { type GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFound } from './errors/resource-not-found'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxDistance } from './errors/max-distance'
import { MaxNumberOfCheckIns } from './errors/max-number-of-check-ins'

interface CheckInServiceRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInServiceResponse {
  checkIn: CheckIn
}

export class CheckInService {
  constructor (
    private readonly checkInsRepository: CheckInsRepository,
    private readonly gymsRepository: GymsRepository
  ) {}

  async execute ({
    userId,
    gymId,
    userLatitude,
    userLongitude
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFound()
    }

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber()
      }
    )
    const MAX_DISTANCE_IN_KILOMETERS = 0.1
    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistance()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    )

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckIns()
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId
    })

    return {
      checkIn
    }
  }
}
