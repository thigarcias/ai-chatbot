import { createOpenAI } from '@ai-sdk/openai'

export const copilot = createOpenAI({
    apiKey: 'a',
    baseURL: 'http://localhost:3000/api/copilot/chat/completions',
})