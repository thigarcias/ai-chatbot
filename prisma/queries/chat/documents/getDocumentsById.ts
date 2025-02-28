import { prisma } from '@/prisma/prisma-client'

export async function getDocumentsById({ id }: { id: string }) {
  try {
    return await prisma.document.findMany({
      where: { id },
      orderBy: { createdAt: 'asc' }
    })
  } catch (error) {
    console.error('Failed to get document by id from database')
    throw error
  }
}
