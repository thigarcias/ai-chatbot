import { copilot } from '../providers/copilot'
import { ChatModel, ModelCategory, ModelProvider } from './index'

// Custom model provider functions
export const claudeFrontend = () => copilot('claude-3.7-sonnet')

// Custom models with specialized system prompts
export const models: Array<ChatModel> = [
  {
    id: 'claude-frontend',
    name: 'Claude Frontend',
    description: 'Senior front-end engineer with skills in Next.js',
    provider: 'custom' as ModelProvider,
    category: 'Custom' as ModelCategory
  }
]

export const customModels = {
  models,
  claudeFrontend
}