import { StringSanitizer } from './utils'

const CHAT_COMPLETIONS_API_ENDPOINT = "https://api.individual.githubcopilot.com/chat/completions"
const MODELS_API_ENDPOINT = "https://api.individual.githubcopilot.com/models"
const MAX_TOKENS = 10240

async function getCopilotToken(): Promise<string> {
  return process.env.COPILOT_TOKEN || "default-token"
}

export function preprocessRequestBody(requestBody: any): any {

  if (!requestBody?.messages) return requestBody

  const sanitizer = new StringSanitizer()
  const processedMessages: any[] = []

  for (const message of requestBody.messages) {
    if (!Array.isArray(message.content)) {
      let content = message.content
      if (typeof content === 'string') {
        const result = sanitizer.sanitize(content)
        content = result.text
      }
      processedMessages.push({ ...message, content })
    } else {
      for (const contentItem of message.content) {
        if (contentItem.type !== "text") {
          throw new Error("Only text type is supported in content array")
        }
        let text = contentItem.text
        if (typeof text === 'string') {
          const result = sanitizer.sanitize(text)
          text = result.text
        }
        processedMessages.push({ role: message.role, content: text })
      }
    }
  }

  if (requestBody.model && requestBody.model.startsWith("o1")) {
    processedMessages.forEach(msg => {
      if (msg.role === "system") msg.role = "user"
    })
  }

  requestBody.max_tokens = requestBody.max_tokens || MAX_TOKENS

  return { ...requestBody, messages: processedMessages }
}

export async function listModels(): Promise<any> {

  const token = await getCopilotToken()
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "editor-version": "vscode/1.95.3"
  }

  const response = await fetch(MODELS_API_ENDPOINT, {
    method: "GET",
    headers
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Models API error: ${errorText}`)
  }
  
  return await response.json()
}
export async function proxyChatCompletions(requestBody: any): Promise<Response> {
  const token = await getCopilotToken()
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "text/event-stream",
    "editor-version": "vscode/1.95.3"
  }
  const body = preprocessRequestBody(requestBody)
  const response = await fetch(CHAT_COMPLETIONS_API_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API error: ${errorText}`)
  }
  
  return response
}
