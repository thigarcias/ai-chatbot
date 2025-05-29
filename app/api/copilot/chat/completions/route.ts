import { NextRequest, NextResponse } from 'next/server'
import { listModels, proxyChatCompletions } from '../../../../../lib/ai/copilot/service'
import { initializeProxy } from '../../../../../lib/ai/copilot/proxy'

initializeProxy()

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')
    const models = await listModels(token)
    return NextResponse.json(models)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = request.headers.get('Authorization')
    const response = await proxyChatCompletions(body, token)
    if (body.stream) {
      return new NextResponse(response.body, {
        headers: { "Content-Type": "text/event-stream" }
      })
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
