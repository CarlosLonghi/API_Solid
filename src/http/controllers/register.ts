import { type FastifyRequest, type FastifyReply } from 'fastify'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { z } from 'zod'

export async function register (request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  const passwordHashed = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (userWithSameEmail) {
    return reply.status(409).send({
      erro: 'Email já cadastrado!'
    })
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: passwordHashed
    }
  })

  return await reply.status(201).send()
}
