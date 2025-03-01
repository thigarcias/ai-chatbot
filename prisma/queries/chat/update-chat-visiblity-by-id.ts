import { prisma } from "@/prisma/prisma-client"

export async function updateChatVisiblityById({
    chatId,
    visibility,
  }: {
    chatId: string
    visibility: 'private' | 'public'
  }) {
    try {
      return await prisma.chat.update({
        where: { id: chatId },
        data: { visibility }
      })
    } catch (error) {
      console.error('Failed to update chat visibility in database')
      throw error
    }
  }