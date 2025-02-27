import { copilot as copilotProvider } from '../providers/copilot'
import { ChatModel, ModelCategory, ModelProvider } from './index'

// Provider function for Copilot models
export const copilot = copilotProvider

// Copilot models
export const models: Array<ChatModel> = [
  {
    id: 'gpt-4o-mini-copilot',
    name: 'GPT 4o-mini',
    description: 'Optimized for rapid code completions',
    provider: 'copilot' as ModelProvider,
    category: 'Copilot' as ModelCategory
  },
  {
    id: 'gpt-4o-copilot',
    name: 'GPT 4o',
    description: 'Ideal model for comprehensive code completions',
    provider: 'copilot' as ModelProvider,
    category: 'Copilot' as ModelCategory
  },
  {
    id: 'o3-mini-copilot',
    name: 'o3 Mini',
    description: 'Balances efficiency and reasoning for coding',
    provider: 'copilot' as ModelProvider,
    category: 'Copilot' as ModelCategory
  },
  {
    id: 'o1-copilot',
    name: 'o1',
    description: 'Experimental model for unique coding tasks',
    provider: 'copilot' as ModelProvider,
    category: 'Copilot' as ModelCategory
  },
  {
    id: 'claude-3.5-sonnet-copilot',
    name: 'Claude 3.5 Sonnet',
    description: 'Creative model for poetic code suggestions',
    provider: 'copilot' as ModelProvider,
    category: 'Copilot' as ModelCategory
  },
  {
    id: 'gemini-2.0-flash-copilot',
    name: 'Gemini 2.0 Flash',
    description: 'High-speed model optimized for coding tasks',
    provider: 'copilot' as ModelProvider,
    category: 'Copilot' as ModelCategory
  }
]

export const copilotModels = {
  models,
  copilot
}