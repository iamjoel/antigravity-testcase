export async function sendMessage(
  apiKey: string,
  query: string,
  user: string,
  conversationId?: string,
  onChunk?: (chunk: string) => void
): Promise<{ conversationId: string; answer: string }> {
  const response = await fetch('https://api.dify.dev/v1/chat-messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: {},
      query,
      response_mode: 'streaming',
      conversation_id: conversationId,
      user,
    }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullAnswer = '';
  let newConversationId = conversationId || '';

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6);
          if (dataStr === '[DONE]') continue;

          try {
            const data = JSON.parse(dataStr);
            if (data.event === 'message' || data.event === 'agent_message') {
              const answer = data.answer;
              fullAnswer += answer;
              if (onChunk) onChunk(answer);
              if (!newConversationId && data.conversation_id) {
                newConversationId = data.conversation_id;
              }
            } else if (data.event === 'error') {
              throw new Error(data.message);
            }
          } catch (e) {
            console.error('Error parsing stream chunk', e);
          }
        }
      }
    }
  }

  return { conversationId: newConversationId, answer: fullAnswer };
}
