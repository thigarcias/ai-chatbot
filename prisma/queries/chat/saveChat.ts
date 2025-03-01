import { prisma } from '@/prisma/prisma-client'

export async function saveChat({
  id,
  userId,
  title,
}: {
  id: string
  userId: string
  title: string
}) {
  try {
    return await prisma.chat.create({
      data: {
        id,
        createdAt: new Date(),
        userId,
        title,
      }
    })
  } catch (error) {
    console.error('Failed to save chat in database')
    throw error
  }
}
