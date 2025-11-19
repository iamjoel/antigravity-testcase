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

export async function getConversations(apiKey: string, user: string, lastId?: string, limit: number = 20) {
  const params = new URLSearchParams({
    user,
    limit: limit.toString(),
  });
  if (lastId) params.append('last_id', lastId);

  const response = await fetch(`https://api.dify.dev/v1/conversations?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function getMessages(apiKey: string, conversationId: string, user: string, firstId?: string, limit: number = 20) {
  const params = new URLSearchParams({
    user,
    conversation_id: conversationId,
    limit: limit.toString(),
  });
  if (firstId) params.append('first_id', firstId);

  const response = await fetch(`https://api.dify.dev/v1/messages?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteConversation(apiKey: string, conversationId: string, user: string) {
  const response = await fetch(`https://api.dify.dev/v1/conversations/${conversationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : { result: 'success' };
}

export async function renameConversation(apiKey: string, conversationId: string, name: string, user: string) {
  const response = await fetch(`https://api.dify.dev/v1/conversations/${conversationId}/name`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, user }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
