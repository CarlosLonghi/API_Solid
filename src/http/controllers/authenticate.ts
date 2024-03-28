import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { InvalidCredentials } from '@/services/errors/invalid-credentials'
import { makeAuthenticateService } from '@/services/factories/make-authenticate-service'

export async function authenticate (request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateService = makeAuthenticateService()

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
