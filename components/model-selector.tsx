'use client'

import { startTransition, useEffect, useMemo, useOptimistic, useState } from 'react'

import { saveChatModelAsCookie } from '@/app/(chat)/actions'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { chatModels } from '@/lib/ai/models'
import { categoryToProviderId, providers } from '@/lib/ai/models/providers'
import { cn } from '@/lib/utils'

import { CheckCircleFillIcon, ChevronDownIcon } from './icons'

export function ModelSelector({
  selectedModelId,
  className,
}: {
  selectedModelId: string
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false)
  const [optimisticModelId, setOptimisticModelId] =
    useOptimistic(selectedModelId)
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null)

  const selectedChatModel = useMemo(
    () => chatModels.find((chatModel) => chatModel.id === optimisticModelId),
    [optimisticModelId],
  )

  // Group models by provider category
  const modelsByProvider = useMemo(() => {
    const grouped: Record<string, typeof chatModels> = {}
    
    providers.forEach(provider => {
      grouped[provider.id] = chatModels.filter(
        model => categoryToProviderId[model.category] === provider.id
      )
    })
    
    return grouped
  }, [])

  // Set initial provider based on selected model
  useEffect(() => {
    if (selectedChatModel && !selectedProviderId) {
      const providerId = categoryToProviderId[selectedChatModel.category]
      setSelectedProviderId(providerId)
    }
  }, [selectedChatModel, selectedProviderId])

  // Get the selected provider info
  const selectedProvider = useMemo(() => {
    return providers.find(p => p.id === selectedProviderId) || providers[0]
  }, [selectedProviderId])

  const SelectedProviderIcon = selectedProvider.icon

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      {/* Provider Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
            <div className="w-5 h-5 relative flex items-center justify-center">
              <SelectedProviderIcon />
            </div>
            <span>{selectedProvider.name}</span>
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[200px]">
          {providers.map((provider) => {
            const ProviderIcon = provider.icon
            return (
              <DropdownMenuItem
                key={provider.id}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setSelectedProviderId(provider.id)
                  // Select the first model from this provider if the current selected model
                  // is not from this provider
                  const providerModels = modelsByProvider[provider.id]
                  if (providerModels.length > 0) {
                    const currentModelIsFromProvider = providerModels.some(
                      model => model.id === optimisticModelId
                    )
                    
                    if (!currentModelIsFromProvider) {
                      const firstModel = providerModels[0]
                      startTransition(() => {
                        setOptimisticModelId(firstModel.id)
                        saveChatModelAsCookie(firstModel.id)
                      })
                    }
                  }
                }}
              >
                <div className="w-5 h-5 relative flex items-center justify-center">
                  <ProviderIcon />
                </div>
                <div className="flex flex-col">
                  <span>{provider.name}</span>
                  <span className="text-xs text-muted-foreground">{provider.description}</span>
                </div>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Model Selector */}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          asChild
          className={cn(
            'w-full sm:w-auto data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
            className,
          )}
        >
          <Button variant="outline" className="md:px-2 md:h-[34px]">
            {selectedChatModel?.name}
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[250px] max-h-[200px] overflow-y-scroll">
          {selectedProviderId && modelsByProvider[selectedProviderId].map((chatModel) => (
            <ModelMenuItem 
              key={chatModel.id}
              chatModel={chatModel}
              isSelected={chatModel.id === optimisticModelId}
              onSelect={() => {
                setOpen(false)
                startTransition(() => {
                  setOptimisticModelId(chatModel.id)
                  saveChatModelAsCookie(chatModel.id)
                })
              }}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function ModelMenuItem({ 
  chatModel, 
  isSelected, 
  onSelect 
}: { 
  chatModel: (typeof chatModels)[0]
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <DropdownMenuItem
      onSelect={onSelect}
      className="gap-4 group/item flex flex-row justify-between items-center"
      data-active={isSelected}
    >
      <div className="flex flex-col gap-1 items-start">
        <div>{chatModel.name}</div>
        <div className="text-xs text-muted-foreground">
          {chatModel.description}
        </div>
      </div>

      <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
        <CheckCircleFillIcon />
      </div>
    </DropdownMenuItem>
  )
}