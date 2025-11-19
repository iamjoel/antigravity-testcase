import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model, apiKey, system } = await req.json();

  const openai = createOpenAI({
    apiKey: apiKey,
  });

  const result = streamText({
    model: openai(model),
    messages,
    system,
  });

  return result.toDataStreamResponse();
}
