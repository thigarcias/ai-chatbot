import { sanitizeUIMessages } from "@/lib/utils"
import { Message } from "ai"
import { Dispatch, SetStateAction, memo } from "react"
import { StopIcon } from "../icons"
import { Button } from "../ui/button"

function PureStopButton({
    stop,
    setMessages,
  }: {
    stop: () => void
    setMessages: Dispatch<SetStateAction<Array<Message>>>
  }) {
    return (
      <Button
        className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
        onClick={(event) => {
          event.preventDefault()
          stop()
          setMessages((messages) => sanitizeUIMessages(messages))
        }}
      >
        <StopIcon size={14} />
      </Button>
    )
  }
  
export const StopButton = memo(PureStopButton)