import { createOpenAI } from '@ai-sdk/openai'

export const copilot = createOpenAI({
    apiKey: 'a',
    baseURL: '/api/copilot/chat/completions',
})