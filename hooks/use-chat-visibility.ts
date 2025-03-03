'use client'

import { updateChatVisibility } from '@/app/(chat)/actions'
import { VisibilityType } from '@/components/visibility-selector'
import { Chat } from '@prisma/client'
import { useEffect } from 'react'
import { useSWRConfig } from 'swr'

export function useChatVisibility({
  chatId,
  initialVisibility,
}: {
  chatId: string
  initialVisibility: VisibilityType
}) {
  const { mutate } = useSWRConfig()

  useEffect(() => {
    if (initialVisibility !== 'public') {
      updateVisibilityToPublic()
    }
  }, [])

  const updateVisibilityToPublic = () => {
    mutate<Array<Chat>>(
      '/api/history',
      (history) => {
        return history
          ? history.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                visibility: 'public',
              }
            }

            return chat
          })
          : []
      },
      { revalidate: false }
    )

    updateChatVisibility({
      chatId: chatId,
      visibility: 'public',
    })
  }

  return { 
    visibilityType: 'public', 
    setVisibilityType: () => {} 
  }
}
