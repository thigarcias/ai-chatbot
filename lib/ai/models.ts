import {
  customProvider,
} from 'ai'
import { openai } from './providers/openai'
import { copilot } from './providers/copilot'

interface ChatModel {
  id: string
  name: string
  description: string
}

export const DEFAULT_CHAT_MODEL: string = 'gpt-4o-mini-gh-models'

export const myProvider = customProvider({
  languageModels: {
    'gpt-4o-mini-gh-models': openai('gpt-4o-mini'),
    'gpt-4o-gh-models': openai('gpt-4o'),
    'o3-mini-gh-models': openai('o3-mini', { reasoningEffort: 'medium' }),
    'gpt-4o-mini-copilot': copilot('gpt-4o-mini'),
    'gpt-4o-copilot': copilot('gpt-4o'),
    'o3-mini-copilot': copilot('o3-mini'),
    'o1-copilot': copilot('o1'),
    'claude-3.5-sonnet-copilot': copilot('claude-3.5-sonnet'),
    'gemini-2.0-flash-copilot': copilot('gemini-2.0-flash-001'),
    'title-model': openai('gpt-4o-mini'),
    'block-model': openai('gpt-4o-mini'),
  },
})

export const chatModels: Array<ChatModel> = [
  {
    id: 'gpt-4o-mini-gh-models',
    name: 'GPT 4o-mini (Github Models)',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'gpt-4o-gh-models',
    name: 'GPT 4o (Github Models)',
    description: 'Large model for complex, multi-step tasks',
  },
  {
    id: 'o3-mini-gh-models',
    name: 'o3 Mini (Github Models)',
    description: 'Uses advanced reasoning',
  },
  {
    id: 'gpt-4o-mini-copilot',
    name: 'GPT 4o-mini (Copilot)',
    description: 'Optimized for rapid code completions',
  },
  {
    id: 'gpt-4o-copilot',
    name: 'GPT 4o (Copilot)',
    description: 'Ideal model for comprehensive code completions',
  },
  {
    id: 'o3-mini-copilot',
    name: 'o3 Mini (Copilot)',
    description: 'Balances efficiency and reasoning for coding',
  },
  {
    id: 'o1-copilot',
    name: 'o1 (Copilot)',
    description: 'Experimental model for unique coding tasks',
  },
  {
    id: 'claude-3.5-sonnet-copilot',
    name: 'Claude 3.5 Sonnet (Copilot)',
    description: 'Creative model for poetic code suggestions',
  },
  {
    id: 'gemini-2.0-flash-copilot',
    name: 'Gemini 2.0 Flash (Copilot)',
    description: 'High-speed model optimized for coding tasks',
  }
]
