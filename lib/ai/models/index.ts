import { customProvider } from 'ai'
import { githubModels } from './github'
import { copilotModels } from './copilot'
import { customModels } from './custom'

export type ModelProvider = 'openai' | 'copilot' | 'custom'
export type ModelCategory = 'GitHub Models' | 'Copilot' | 'Custom'

export interface ChatModel {
  id: string
  name: string
  description: string
  provider: ModelProvider
  category: ModelCategory
}

export const DEFAULT_CHAT_MODEL: string = 'gpt-4o-mini-gh-models'

export const myProvider = customProvider({
  languageModels: {
    // GitHub Models
    'gpt-4o-mini-gh-models': githubModels.openai('gpt-4o-mini'),
    'gpt-4o-gh-models': githubModels.openai('gpt-4o'),
    'o3-mini-gh-models': githubModels.openai('o3-mini', { reasoningEffort: 'medium' }),
    
    // Copilot Models
    'gpt-4o-mini-copilot': copilotModels.copilot('gpt-4o-mini'),
    'gpt-4o-copilot': copilotModels.copilot('gpt-4o'),
    'o3-mini-copilot': copilotModels.copilot('o3-mini'),
    'o1-copilot': copilotModels.copilot('o1'),
    'claude-3.5-sonnet-copilot': copilotModels.copilot('claude-3.5-sonnet'),
    'gemini-2.0-flash-copilot': copilotModels.copilot('gemini-2.0-flash-001'),
    'claude-3.7-sonnet': copilotModels.copilot('claude-3.7-sonnet'),
    'claude-3.7-sonnet-thought': copilotModels.copilot('claude-3.7-sonnet-thought'),
    
    // Utility Models
    'title-model': githubModels.openai('gpt-4o-mini'),
    'artifact-model': githubModels.openai('gpt-4o-mini'),
    
    // Custom Models
    'claude-frontend': customModels.claudeFrontend(),
  },
})

// Combine all models into a single array
export const chatModels: Array<ChatModel> = [
  ...githubModels.models,
  ...copilotModels.models,
  ...customModels.models
]
