import { ArrowUpIcon } from "lucide-react"
import { memo } from "react"
import { Button } from "../ui/button"

function PureSendButton({
    submitForm,
    input,
    uploadQueue,
  }: {
    submitForm: () => void
    input: string
    uploadQueue: Array<string>
  }) {
    return (
      <Button
        className="rounded-full p-2 h-fit border dark:border-gray-600"
        onClick={(event) => {
          event.preventDefault()
          submitForm()
        }}
        disabled={input.length === 0 || uploadQueue.length > 0}
      >
        <ArrowUpIcon size={14} />
      </Button>
    )
  }
  
  export const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
    if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length)
      return false
    if (prevProps.input !== nextProps.input) return false
  
    return true
  })