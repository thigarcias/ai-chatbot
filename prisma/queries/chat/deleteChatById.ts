import { prisma } from '@/prisma/prisma-client'

export async function deleteChatById({ id }: { id: string }) {
  try {
    // Delete related records first due to foreign key constraints
    await prisma.vote.deleteMany({
      where: { chatId: id }
    })
    await prisma.message.deleteMany({
      where: { chatId: id }
    })

    return await prisma.chat.delete({
      where: { id }
    })
  } catch (error) {
    console.error('Failed to delete chat by id from database')
    throw error
  }
}
