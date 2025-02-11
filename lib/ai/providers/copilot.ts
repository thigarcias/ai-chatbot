import { createOpenAI } from '@ai-sdk/openai'

export const copilot = createOpenAI({
    apiKey: 'a',
    baseURL: 'http://localhost:15432',
})