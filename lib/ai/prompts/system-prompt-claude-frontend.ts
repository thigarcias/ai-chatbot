import { customSystemPrompt } from "../custom-prompts"
import { chatModels } from "../models"
import { artifactsPrompt } from "./artifacts-prompt"
import { regularPrompt, systemPrompt } from "./system-prompt"
import { searchToolPrompt } from "./search-prompt"

export const systemPromptClaudeFrontend = ({
    selectedChatModel,
    useArtifact = false,
    useSearch = false,
  }: {
    selectedChatModel: string
    useArtifact?: boolean
    useSearch?: boolean
  }) => {
    // Find the model in the chatModels array to check its category
    const model = chatModels.find(model => model.id === selectedChatModel)
    
    // Apply custom system prompt for models in the Custom category
    if (model && model.category === 'Custom') {
      let prompt = regularPrompt
  
      // Apenas inclui o artifactsPrompt se useArtifact estiver ativo
      if (useArtifact) {
        prompt += `\n\n${artifactsPrompt}`
      }
  
      // Apenas inclui o searchToolPrompt se useSearch estiver ativo
      if (useSearch) {
        prompt += `\n\n${searchToolPrompt}`
      }
  
      return `${prompt}\n\n${customSystemPrompt}`
    } else {
      return systemPrompt({ selectedChatModel, useArtifact, useSearch })
    }
  }