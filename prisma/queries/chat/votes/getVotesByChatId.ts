import { prisma } from '@/prisma/prisma-client'

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return await prisma.vote.findMany({
      where: { chatId: id }
    })
  } catch (error) {
    console.error('Failed to get votes by chat id from database', error)
    throw error
  }
}
