import { prisma } from '@/prisma/prisma-client'
import { Suggestion } from '@prisma/client'

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>
}) {
  try {
    return await prisma.suggestion.createMany({
      data: suggestions
    })
  } catch (error) {
    console.error('Failed to save suggestions in database')
    throw error
  }
}
