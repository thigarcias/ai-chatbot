import { prisma } from '@/prisma/prisma-client'

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string
}) {
  try {
    return await prisma.suggestion.findMany({
      where: { documentId }
    })
  } catch (error) {
    console.error('Failed to get suggestions by document version from database')
    throw error
  }
}
