import { prisma } from '@/prisma/prisma-client'

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string
  timestamp: Date
}) {
  try {
    return await prisma.message.deleteMany({
      where: {
        chatId,
        createdAt: { gte: timestamp }
      }
    })
  } catch (error) {
    console.error('Failed to delete messages by id after timestamp from database')
    throw error
  }
}
