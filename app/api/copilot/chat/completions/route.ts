import { NextRequest, NextResponse } from 'next/server';
import { listModels, proxyChatCompletions } from '../../../../../lib/ai/copilot/service';
import { initializeProxy } from '../../../../../lib/ai/copilot/proxy';

// Inicializa o proxy se necessário
initializeProxy();

export async function GET() {
    try {
        console.log("GET /api/copilot - Iniciando listagem de modelos");
        const models = await listModels();
        return NextResponse.json(models);
    } catch (error: any) {
        console.log("GET /api/copilot - Erro:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log("POST /api/copilot - Requisição recebida");
        const body = await request.json();
        console.log("POST /api/copilot - Body recebido:", body);
        const response = await proxyChatCompletions(body);
        const isEventStream = response.headers.get("content-type")?.includes("text/event-stream");
        if (isEventStream) {
            console.log("POST /api/copilot - Encaminhando streaming response");
            return new NextResponse(response.body, {
                headers: { "Content-Type": "text/event-stream" }
            });
        }
        const data = await response.json();
        console.log("POST /api/copilot - Resposta JSON:", data);
        return NextResponse.json(data);
    } catch (error: any) {
        console.log("POST /api/copilot - Erro no endpoint:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
