import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateService } from '@/services/authenticate'
import { InvalidCredentials } from '@/services/errors/invalid-credentials'

export async function authenticate (request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const authenticateService = new AuthenticateService(usersRepository)

    await authenticateService.execute({
      email,
      password
    })
  } catch (error) {
    if (error instanceof InvalidCredentials) {
      return await reply.status(400).send({ message: error.message })
    }

    throw error
  }
  return await reply.status(200).send()
}
