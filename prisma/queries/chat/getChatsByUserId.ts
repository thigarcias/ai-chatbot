import { prisma } from '@/prisma/prisma-client'

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await prisma.chat.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Failed to get chats by user from database')
    throw error
  }
}
