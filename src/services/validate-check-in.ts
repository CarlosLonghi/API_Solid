import { type CheckIn } from '@prisma/client'
import { type CheckInsRepository } from '@/repositories/check-ins-repository'
import { ResourceNotFound } from './errors/resource-not-found'
import dayjs from 'dayjs'
import { LateCkeckInValidationError } from './errors/late-check-in-validation-error'

interface ValidateCheckInServiceRequest {
  checkInId: string
}

interface ValidateCheckInServiceResponse {
  checkIn: CheckIn
}

export class ValidateCheckInService {
  constructor (
    private readonly checkInsRepository: CheckInsRepository
  ) {}

  async execute ({
    checkInId
  }: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFound()
    }

    const gapInMinutesFromCheckInCreation = dayjs(new Date()).diff(checkIn.created_at, 'minutes')

    if (gapInMinutesFromCheckInCreation > 20) {
      throw new LateCkeckInValidationError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn
    }
  }
}
