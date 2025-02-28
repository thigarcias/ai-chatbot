import { prisma } from '@/prisma/prisma-client'

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string
  timestamp: Date
}) {
  try {
    await prisma.suggestion.deleteMany({
      where: {
        documentId: id,
        documentCreatedAt: { gt: timestamp }
      }
    })

    return await prisma.document.deleteMany({
      where: {
        id,
        createdAt: { gt: timestamp }
      }
    })
  } catch (error) {
    console.error('Failed to delete documents by id after timestamp from database')
    throw error
  }
}
