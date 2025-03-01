import { prisma } from '@/prisma/prisma-client'
import { type User } from '@prisma/client'

export async function getUser(email: string): Promise<User | null> {
  const data = await prisma.user.findUnique({
    where: { email }
  })

  return data
}
