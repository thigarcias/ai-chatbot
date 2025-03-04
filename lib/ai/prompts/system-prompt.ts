import { claudeFrontEnd } from '../custom-prompts'
import { artifactsPrompt } from './artifacts-prompt'
import { searchToolPrompt } from './search-prompt'

export const regularPrompt = 'Você é um assistente amigável! Mantenha suas respostas concisas e úteis.'

export const systemPrompt = ({
  selectedChatModel,
  useArtifact = false,
  useSearch = false,
}: {
  selectedChatModel: string
  useArtifact?: boolean
  useSearch?: boolean
}) => {
  if (selectedChatModel === 'chat-model-reasoning') return regularPrompt
  if (selectedChatModel === 'claude-frontend') return claudeFrontEnd
  let prompt = regularPrompt
  if (useArtifact) prompt += `\n\n${artifactsPrompt}`
  if (useSearch) prompt += `\n\n${searchToolPrompt}`
  return prompt
}