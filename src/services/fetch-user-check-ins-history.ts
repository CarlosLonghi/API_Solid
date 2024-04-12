import { type CheckIn } from '@prisma/client'
import { type CheckInsRepository } from '@/repositories/check-ins-repository'

interface FetchUserCheckInsHistoryServiceRequest {
  userId: string
}

interface FetchUserCheckInsHistoryServiceResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryService {
  constructor (
    private readonly checkInsRepository: CheckInsRepository
  ) {}

  async execute ({
    userId
  }: FetchUserCheckInsHistoryServiceRequest): Promise<FetchUserCheckInsHistoryServiceResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId)

    return {
      checkIns
    }
  }
}
