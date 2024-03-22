import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { RegisterService } from '@/services/register'

export async function register (request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    await RegisterService({
      name,
      email,
      password
    })
  } catch (e) {
    return await reply.status(409).send()
  }
  return await reply.status(201).send()
}
