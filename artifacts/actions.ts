'use server'

import { getSuggestionsByDocumentId } from "@/prisma/queries/chat"

export async function getSuggestions({ documentId }: { documentId: string }) {
  const suggestions = await getSuggestionsByDocumentId({ documentId })

  return suggestions ?? []
}
