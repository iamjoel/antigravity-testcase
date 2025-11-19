'use server';

import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

export async function generateTitle(
  model: string,
  userMessage: string,
  assistantMessage: string
): Promise<string> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing OPENAI_API_KEY');
    }

    const openai = createOpenAI({
      apiKey: apiKey,
    });

    const { text } = await generateText({
      model: openai(model),
      system: `You are a conversation title generator. 
Generate a concise, engaging title (max 5 words) for the following conversation. 
Do not use quotes. Return ONLY the title text.`,
      messages: [
        { role: 'user', content: userMessage },
        { role: 'assistant', content: assistantMessage },
      ],
    });

    return text.trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error('Failed to generate title:', error);
    return 'New Chat';
  }
}
