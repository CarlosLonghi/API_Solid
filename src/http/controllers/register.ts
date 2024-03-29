import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { RegisterService } from '@/services/register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExists } from '@/services/errors/user-already-exists'

export async function register (request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const registerService = new RegisterService(usersRepository)

    await registerService.execute({
      name,
      email,
      password
    })
  } catch (error) {
    if (error instanceof UserAlreadyExists) {
      return await reply.status(409).send({ message: error.message })
    }

    throw error
  }
  return await reply.status(201).send()
}
