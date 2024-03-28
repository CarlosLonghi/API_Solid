import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExists } from '@/services/errors/user-already-exists'
import { makeRegisterService } from '@/services/factories/make-register-service'

export async function register (request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerService = makeRegisterService()

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
