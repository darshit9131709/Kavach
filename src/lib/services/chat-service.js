import { forwardAryaChat } from '@/lib/ai/arya-client';

export async function forwardChatToArya({ session, message, history }) {
  const endpointUrl =
    process.env.ARYA_AI_ENDPOINT_URL || 'https://example.com/ai/chat';
  const apiKey = process.env.ARYA_AI_API_KEY || '';

  return forwardAryaChat({
    endpointUrl,
    apiKey,
    message,
    history,
    metadata: {
      userId: session.user.id,
      role: session.user.role,
    },
  });
}

