import { createOpenAI } from '@ai-sdk/openai'

export const openai = createOpenAI({
    apiKey: process.env.GITHUB_TOKEN,
    baseURL: 'https://models.inference.ai.azure.com',
})