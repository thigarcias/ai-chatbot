import { prisma } from '@/prisma/prisma-client'

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string
  messageId: string
  type: 'up' | 'down'
}) {
  try {
    const existingVote = await prisma.vote.findFirst({
      where: { messageId }
    })

    if (existingVote) {
      return await prisma.vote.update({
        where: {
          chatId_messageId: {
            chatId,
            messageId
          }
        },
        data: { isUpvoted: type === 'up' }
      })
    }

    return await prisma.vote.create({
      data: {
        chatId,
        messageId,
        isUpvoted: type === 'up',
      }
    })
  } catch (error) {
    console.error('Failed to upvote message in database', error)
    throw error
  }
}
