import { prisma } from '@/prisma/prisma-client'

export async function getMessageById({ id }: { id: string }) {
  try {
    return await prisma.message.findUnique({
      where: { id }
    })
  } catch (error) {
    console.error('Failed to get message by id from database')
    throw error
  }
}
