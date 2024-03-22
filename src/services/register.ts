import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

interface RegisterServiceProps {
  name: string
  email: string
  password: string
}

export async function RegisterService ({
  name, email, password
}: RegisterServiceProps) {
  const passwordHashed = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (userWithSameEmail !== null) {
    throw new Error('Email já cadastrado!')
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: passwordHashed
    }
  })
}
