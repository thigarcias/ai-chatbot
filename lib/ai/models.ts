import { createOpenAI } from '@ai-sdk/openai'
import { fireworks } from '@ai-sdk/fireworks'
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai'

export const DEFAULT_CHAT_MODEL: string = 'gpt-4o-mini-gh-models'
const openai = createOpenAI({
  apiKey: process.env.GITHUB_TOKEN,
  baseURL: 'https://models.inference.ai.azure.com',
})

export const myProvider = customProvider({
  languageModels: {
    'gpt-4o-mini-gh-models': openai('gpt-4o-mini', {
    }),
    'gpt-4o-gh-models': openai('gpt-4o'),
    'o3-mini-gh-models': openai('o3-mini', { reasoningEffort: 'medium' }),
    'title-model': openai('gpt-4o-mini'),
    'block-model': openai('gpt-4o-mini'),
  },
  imageModels: {
    'small-model': openai.image('dall-e-2'),
    'large-model': openai.image('dall-e-3'),
  },
})

interface ChatModel {
  id: string
  name: string
  description: string
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'gpt-4o-mini-gh-models',
    name: 'GPT 4o-mini GH-Models',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'gpt-4o-gh-models',
    name: 'GPT 4o GH-Models',
    description: 'Large model for complex, multi-step tasks',
  },
  {
    id: 'o3-mini-gh-models',
    name: 'o3 Mini GH-Models',
    description: 'Uses advanced reasoning',
  },
]
