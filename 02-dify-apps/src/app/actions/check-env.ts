'use server';

export async function checkOpenAIKey() {
  return !!process.env.OPENAI_API_KEY;
}
