
import type { Message } from 'ai'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { useCopyToClipboard } from 'usehooks-ts'

import type { Vote } from '@prisma/client'

import { ThumbsUp, ThumbsDown, Copy } from 'lucide-react'
import { Button } from './ui/button'
import { memo } from 'react'
import equal from 'fast-deep-equal'

export function PureMessageActions({
  chatId,
  message,
  vote,
  isLoading,
}: {
  chatId: string
  message: Message
  vote: Vote | undefined
  isLoading: boolean
}) {
  const { mutate } = useSWRConfig()
  const [, copyToClipboard] = useCopyToClipboard()

  if (isLoading) return null
  if (message.role === 'user') return null
  if (message.toolInvocations && message.toolInvocations.length > 0)
    return null

  return (
      <div className="flex flex-row gap-2">
            <Button
              className="py-1 px-2 h-fit text-muted-foreground"
              variant="outline"
              onClick={async () => {
                await copyToClipboard(message.content as string)
                toast.success('Copied to clipboard!')
              }}
            >
              <Copy />
            </Button>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
              disabled={vote?.isUpvoted}
              variant="outline"
              onClick={async () => {
                const upvote = fetch('/api/vote', {
                  method: 'PATCH',
                  body: JSON.stringify({
                    chatId,
                    messageId: message.id,
                    type: 'up',
                  }),
                })

                toast.promise(upvote, {
                  loading: 'Upvoting Response...',
                  success: () => {
                    mutate<Array<Vote>>(
                      `/api/vote?chatId=${chatId}`,
                      (currentVotes) => {
                        if (!currentVotes) return []

                        const votesWithoutCurrent = currentVotes.filter(
                          (vote) => vote.messageId !== message.id,
                        )

                        return [
                          ...votesWithoutCurrent,
                          {
                            chatId,
                            messageId: message.id,
                            isUpvoted: true,
                          },
                        ]
                      },
                      { revalidate: false },
                    )

                    return 'Upvoted Response!'
                  },
                  error: 'Failed to upvote response.',
                })
              }}
            >
              <ThumbsUp />
            </Button>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
              variant="outline"
              disabled={vote && !vote.isUpvoted}
              onClick={async () => {
                const downvote = fetch('/api/vote', {
                  method: 'PATCH',
                  body: JSON.stringify({
                    chatId,
                    messageId: message.id,
                    type: 'down',
                  }),
                })

                toast.promise(downvote, {
                  loading: 'Downvoting Response...',
                  success: () => {
                    mutate<Array<Vote>>(
                      `/api/vote?chatId=${chatId}`,
                      (currentVotes) => {
                        if (!currentVotes) return []

                        const votesWithoutCurrent = currentVotes.filter(
                          (vote) => vote.messageId !== message.id,
                        )

                        return [
                          ...votesWithoutCurrent,
                          {
                            chatId,
                            messageId: message.id,
                            isUpvoted: false,
                          },
                        ]
                      },
                      { revalidate: false },
                    )

                    return 'Downvoted Response!'
                  },
                  error: 'Failed to downvote response.',
                })
              }}
            >
              <ThumbsDown />
            </Button>
      </div>
  )
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (!equal(prevProps.vote, nextProps.vote)) return false
    if (prevProps.isLoading !== nextProps.isLoading) return false

    return true
  },
)
