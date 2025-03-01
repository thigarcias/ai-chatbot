import { prisma } from '@/prisma/prisma-client'

export async function getDocumentById({ id }: { id: string }) {
  try {
    return await prisma.document.findFirst({
      where: { id },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Failed to get document by id from database')
    throw error
  }
}
