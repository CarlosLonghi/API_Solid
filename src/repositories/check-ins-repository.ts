import { type CheckIn, type Prisma } from '@prisma/client'

export interface CheckInsRepository {
  findByUserIdOnDate: (userId: string, date: Date) => Promise<CheckIn | null>
  findManyByUserId: (user_id: string) => Promise<CheckIn[]>
  create: (data: Prisma.CheckInUncheckedCreateInput) => Promise<CheckIn>
}
