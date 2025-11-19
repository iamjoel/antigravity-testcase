import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, model, apiKey: clientApiKey, system } = await req.json();
    const apiKey = clientApiKey || process.env.OPENAI_API_KEY;
    console.log("API Route Request:", { model, system, messageCount: messages?.length, firstMessage: messages?.[0], hasKey: !!apiKey });

    if (!apiKey) {
      return new Response("Missing API Key", { status: 400 });
    }

    const openai = createOpenAI({
      apiKey: apiKey,
    });

    const result = streamText({
      model: openai(model),
      messages,
      system,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("API Route Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
