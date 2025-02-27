import { openai as openaiProvider } from '../providers/openai'
import { ChatModel, ModelCategory, ModelProvider } from './index'

// Provider function for GitHub/OpenAI models
export const openai = openaiProvider

// GitHub models 
export const models: Array<ChatModel> = [
  {
    id: 'gpt-4o-mini-gh-models',
    name: 'GPT 4o-mini',
    description: 'Small model for fast, lightweight tasks',
    provider: 'openai' as ModelProvider,
    category: 'GitHub Models' as ModelCategory
  },
  {
    id: 'gpt-4o-gh-models',
    name: 'GPT 4o',
    description: 'Large model for complex, multi-step tasks',
    provider: 'openai' as ModelProvider,
    category: 'GitHub Models' as ModelCategory
  },
  {
    id: 'o3-mini-gh-models',
    name: 'o3 Mini',
    description: 'Uses advanced reasoning',
    provider: 'openai' as ModelProvider,
    category: 'GitHub Models' as ModelCategory
  }
]

export const githubModels = {
  models,
  openai
}