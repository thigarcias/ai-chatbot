import { prisma } from '@/prisma/prisma-client'
import { DocumentKind } from '@prisma/client'

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string
  title: string
  kind: DocumentKind
  content: string
  userId: string
}) {
  try {
    return await prisma.document.upsert({
      where: { id },
      update: {
        title,
        content,
        userId,
        kind
      },
      create: {
        id,
        title,
        content,
        userId,
        kind,
        createdAt: new Date(),
      }
    })
  } catch (error) {
    console.error('Failed to save document in database', error)
    throw error
  }
}
