import { prisma } from '@/prisma/prisma-client'
import { Prisma } from '@prisma/client'

export async function saveMessages({ messages }: { messages: Array<{
  id: string
  chatId: string
  role: string
  content: Prisma.InputJsonValue
  createdAt: Date
}> }) {
  try {
    return await prisma.message.createMany({
      data: messages
    })
  } catch (error) {
    console.error('Failed to save messages in database', error)
    throw error
  }
}
