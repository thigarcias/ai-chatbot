'use client'

import type {
  Attachment,
  ChatRequestOptions,
  CreateMessage,
  Message,
} from 'ai'
import cx from 'classnames'
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
  memo,
} from 'react'
import { toast } from 'sonner'
import { useLocalStorage, useWindowSize } from 'usehooks-ts'

import { sanitizeUIMessages } from '@/lib/utils'

import { ArrowUpIcon, PaperclipIcon, StopIcon } from './icons'
import { PreviewAttachment } from './preview-attachment'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import equal from 'fast-deep-equal'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Input } from './ui/input' // Add Input import
import { Globe } from 'lucide-react'

// Search option types
interface SearchOptions {
  enabled: boolean;
  deepResearch: boolean;
  numberOfSources: number;
}

function PureMultimodalInput({
  chatId,
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  setMessages,
  handleSubmit,
  className,
}: {
  chatId: string
  input: string
  setInput: (value: string) => void
  isLoading: boolean
  stop: () => void
  attachments: Array<Attachment>
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>
  messages: Array<Message>
  setMessages: Dispatch<SetStateAction<Array<Message>>>
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>
  handleSubmit: (
    event?: {
      preventDefault?: () => void
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void
  className?: string
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { width } = useWindowSize()
  
  // Search options state
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    enabled: false,
    deepResearch: false,
    numberOfSources: 3
  });

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight()
    }
  }, [])

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`
    }
  }

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = '98px'
    }
  }

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    'input',
    '',
  )

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || ''
      setInput(finalValue)
      adjustHeight()
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setLocalStorageInput(input)
  }, [input, setLocalStorageInput])

  const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
    adjustHeight()
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([])

  const submitForm = useCallback(() => {
    window.history.replaceState({}, '', `/chat/${chatId}`)

    // Include search options in request if search is enabled
    const chatOptions: ChatRequestOptions = {
      experimental_attachments: attachments,
      data: searchOptions.enabled ? {
        useSearch: searchOptions.enabled,
        useScrape: searchOptions.deepResearch,
        numberOfResults: searchOptions.numberOfSources
      } : undefined
    }
    

    handleSubmit(undefined, chatOptions);

    setAttachments([])
    setLocalStorageInput('')
    resetHeight()

    if (width && width > 768) {
      textareaRef.current?.focus()
    }
  }, [
    attachments,
    handleSubmit,
    setAttachments,
    setLocalStorageInput,
    width,
    chatId,
    searchOptions
  ])

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const { url, pathname, contentType } = data

        return {
          url,
          name: pathname,
          contentType: contentType,
        }
      }
      const error = await response.json()
      toast.error(error)
    } catch (e) {
      console.log(e)
      toast.error('Failed to upload file, please try again!')
    }
  }

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || [])

      setUploadQueue(files.map((file) => file.name))

      try {
        const uploadPromises = files.map((file) => uploadFile(file))
        const uploadedAttachments = await Promise.all(uploadPromises)
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined,
        )

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ])
      } catch (error) {
        toast.error('Failed to upload file, please try again!' + error)
      } finally {
        setUploadQueue([])
      }
    },
    [setAttachments],
  )

  return (
    <div className="relative w-full flex flex-col gap-4">
      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div className="flex flex-row gap-2 overflow-x-scroll items-end">
          {attachments.map((attachment) => (
            <PreviewAttachment key={attachment.url} attachment={attachment} />
          ))}

          {uploadQueue.map((filename) => (
            <PreviewAttachment
              key={filename}
              attachment={{
                url: '',
                name: filename,
                contentType: '',
              }}
              isUploading={true}
            />
          ))}
        </div>
      )}

      <Textarea
        ref={textareaRef}
        placeholder="Como podemos te ajudar hoje?"
        value={input}
        onChange={handleInput}
        className={cx(
          'min-h-[36px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base dark:bg-[#303030] pb-10',
          className,
        )}
        rows={3}
        autoFocus
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()

            if (isLoading) {
              toast.error('Please wait for the model to finish its response!')
            } else {
              submitForm()
            }
          }
        }}
      />

      <div className="absolute bottom-0 p-2 w-fit flex flex-row justify-start">
        <AttachmentsButton fileInputRef={fileInputRef} isLoading={isLoading} />
        <WebSearchButton 
          searchOptions={searchOptions} 
          setSearchOptions={setSearchOptions} 
          isLoading={isLoading} 
        />
      </div>

      <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end">
        {isLoading ? (
          <StopButton stop={stop} setMessages={setMessages} />
        ) : (
          <SendButton
            input={input}
            submitForm={submitForm}
            uploadQueue={uploadQueue}
          />
        )}
      </div>
    </div>
  )
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false
    if (prevProps.isLoading !== nextProps.isLoading) return false
    if (!equal(prevProps.attachments, nextProps.attachments)) return false

    return true
  },
)

function PureAttachmentsButton({
  fileInputRef,
  isLoading,
}: {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>
  isLoading: boolean
}) {
  return (
    <Button
      className="rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200"
      onClick={(event) => {
        event.preventDefault()
        fileInputRef.current?.click()
      }}
      disabled={isLoading}
      variant="ghost"
    >
      <PaperclipIcon size={14} />
    </Button>
  )
}

const AttachmentsButton = memo(PureAttachmentsButton)

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

const StopButton = memo(PureStopButton)

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

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length)
    return false
  if (prevProps.input !== nextProps.input) return false

  return true
})

function WebSearchButton({ 
  searchOptions, 
  setSearchOptions, 
  isLoading 
}: { 
  searchOptions: SearchOptions, 
  setSearchOptions: Dispatch<SetStateAction<SearchOptions>>, 
  isLoading: boolean 
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cx(
            "rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200",
            searchOptions.enabled && "bg-blue-100 dark:bg-blue-900"
          )}
          variant="ghost"
          disabled={isLoading}
        >
          <Globe />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3">
        <div className="space-y-3">
          <h4 className="font-medium leading-none mb-2">Web Search</h4>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="search-enabled" className="text-sm">Enable Search</Label>
            <Switch 
              id="search-enabled" 
              checked={searchOptions.enabled}
              onCheckedChange={(checked) => 
                setSearchOptions(prev => ({ ...prev, enabled: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label 
              htmlFor="deep-research" 
              className={cx("text-sm", !searchOptions.enabled && "text-gray-400")}
            >
              Deep Research
            </Label>
            <Switch 
              id="deep-research" 
              disabled={!searchOptions.enabled}
              checked={searchOptions.deepResearch}
              onCheckedChange={(checked) => 
                setSearchOptions(prev => ({ ...prev, deepResearch: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label 
              htmlFor="sources-count" 
              className={cx("text-sm", !searchOptions.enabled && "text-gray-400")}
            >
              Number of Sources
            </Label>
            <Input 
              id="sources-count"
              type="number"
              min={1}
              max={10}
              disabled={!searchOptions.enabled}
              value={searchOptions.numberOfSources}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (isNaN(value)) return;
                
                // Clamp value between 1 and 10
                const clampedValue = Math.min(Math.max(value, 1), 10);
                setSearchOptions(prev => ({ ...prev, numberOfSources: clampedValue }));
              }}
              className="w-16 h-8 text-center"
            />
          </div>
          
          {searchOptions.enabled && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {searchOptions.deepResearch 
                ? `Deep research analyzes ${searchOptions.numberOfSources} sources.` 
                : `Basic search from ${searchOptions.numberOfSources} sources.`}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
