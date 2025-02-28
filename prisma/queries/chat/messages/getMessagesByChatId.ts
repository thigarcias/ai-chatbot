import { prisma } from '@/prisma/prisma-client'

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await prisma.message.findMany({
      where: { chatId: id },
      orderBy: { createdAt: 'asc' }
    })
  } catch (error) {
    console.error('Failed to get messages by chat id from database', error)
    throw error
  }
}
