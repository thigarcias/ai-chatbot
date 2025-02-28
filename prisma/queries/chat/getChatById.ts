import { prisma } from '@/prisma/prisma-client'

export async function getChatById({ id }: { id: string }) {
  try {
    return await prisma.chat.findUnique({
      where: { id }
    })
  } catch (error) {
    console.error('Failed to get chat by id from database')
    throw error
  }
}
