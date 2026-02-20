/**
 * Arya chat client (forwarder only).
 *
 * This module deliberately does NOT implement AI logic.
 * It only forwards messages to an external AI endpoint.
 */

function withTimeout(ms) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  return { controller, timeoutId };
}

export async function forwardAryaChat({
  endpointUrl,
  apiKey,
  message,
  history = [],
  metadata = {},
}) {
  if (!endpointUrl) {
    throw new Error('Missing AI endpoint URL');
  }
  if (!message || typeof message !== 'string') {
    throw new Error('Message is required');
  }

  const { controller, timeoutId } = withTimeout(25000);

  try {
    const res = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        message,
        history,
        metadata,
      }),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg =
        data?.error ||
        data?.message ||
        `AI endpoint error (status ${res.status})`;
      const err = new Error(msg);
      err.status = res.status;
      err.details = data;
      throw err;
    }

    // Expecting external endpoint to return either:
    // - { reply: "..." } or { outputText: "..." } or { message: "..." }
    const reply =
      data?.reply ?? data?.outputText ?? data?.message ?? data?.text ?? '';

    if (!reply) {
      throw new Error('AI endpoint returned an empty response');
    }

    return { reply, raw: data };
  } finally {
    clearTimeout(timeoutId);
  }
}

