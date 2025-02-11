import { createOpenAI } from '@ai-sdk/openai'

export const copilot = createOpenAI({
    apiKey: 'a',
    baseURL: process.env.COPILOT_BASE_URL || 'http://localhost:3000/api/copilot'
})