import { apiJson, handleApiError, requireSession } from '@/lib/api-helpers';
import { forwardChatToArya } from '@/lib/services/chat-service';

/**
 * POST /api/chat
 *
 * Body:
 * - message: string (required)
 * - history: array (optional)  // kept generic; forwarded as-is
 *
 * Behavior:
 * - Validates session (user must be logged in)
 * - Forwards payload to external AI endpoint (placeholder URL)
 * - Returns: { reply }
 *
 * Note: No AI logic is implemented here.
 */
export async function POST(request) {
  try {
    const session = await requireSession('Unauthorized');

    const body = await request.json().catch(() => ({}));
    const message = typeof body?.message === 'string' ? body.message : '';
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!message.trim()) {
      return apiJson({ error: 'Message is required' }, 400);
    }

    const { reply } = await forwardChatToArya({
      session,
      message: message.trim(),
      history,
    });

    return apiJson({ reply }, 200);
  } catch (error) {
    console.error('Chat API error:', error);
    // Preserve existing behavior: if forwarder set error.status, pass it through,
    // otherwise return 500 with a generic message.
    if (typeof error?.status === 'number') {
      return apiJson({ error: error?.message || 'Failed to process chat request' }, error.status);
    }
    return handleApiError(error, error?.message || 'Failed to process chat request', 500);
  }
}

