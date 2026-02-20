'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import MessageBubble from '@/components/chat/MessageBubble';
import TypingIndicator from '@/components/chat/TypingIndicator';

function formatTime(d) {
  try {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function AryaChatPage() {
  const [messages, setMessages] = useState(() => [
    {
      id: 'seed-arya-1',
      role: 'assistant',
      text: "Hi there! I'm Arya, your Kavach safety companion. How can I help you stay safe tonight?",
      createdAt: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const scrollRef = useRef(null);
  const listRef = useRef(null);

  const todayLabel = useMemo(() => {
    const now = new Date();
    return `Today, ${formatTime(now)}`;
  }, []);

  useEffect(() => {
    // Keep chat pinned to bottom on new messages
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages.length, isSending]);

  const buildHistory = (nextMessages) => {
    // Keep it generic; the API just forwards this.
    // Exclude the seed greeting if you don't want it upstream.
    return nextMessages
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.text }));
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setError('');
    setIsSending(true);

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      createdAt: new Date(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: buildHistory(nextMessages),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to send message');
      }

      const replyText = String(data?.reply || '').trim();
      if (!replyText) {
        throw new Error('Arya returned an empty reply');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: replyText,
          createdAt: new Date(),
        },
      ]);
    } catch (e) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased">
      <div className="relative flex h-screen w-full max-w-md mx-auto flex-col bg-white dark:bg-background-dark overflow-hidden shadow-2xl">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                <span className="material-symbols-outlined text-primary">
                  smart_toy
                </span>
              </div>
              <div className="absolute bottom-0 right-0 size-3 bg-safe-green border-2 border-white dark:border-background-dark rounded-full"></div>
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">Arya</h1>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-safe-green">
                  Status: Safe
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              aria-label="Settings"
              onClick={() => {}}
            >
              <span className="material-symbols-outlined text-[20px]">
                settings
              </span>
            </button>
          </div>
        </header>

        {/* Conversation */}
        <main
          ref={listRef}
          className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
        >
          <div className="flex justify-center">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {todayLabel}
            </span>
          </div>

          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              role={m.role}
              text={m.text}
              time={formatTime(m.createdAt)}
            />
          ))}

          {isSending ? <TypingIndicator /> : null}

          {error ? (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          ) : null}

          <div ref={scrollRef} />
        </main>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center justify-center size-12 bg-sos-red text-white rounded-xl shadow-lg shadow-sos-red/30 active:scale-95 transition-transform shrink-0"
              aria-label="Emergency"
              onClick={() => {}}
            >
              <span className="material-symbols-outlined font-bold text-2xl">
                emergency
              </span>
            </button>

            <div className="relative flex-1">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                disabled={isSending}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/50 rounded-xl px-4 py-3 text-sm pr-10 disabled:opacity-60"
                placeholder="Type a message..."
                type="text"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary p-1 disabled:opacity-50"
                onClick={handleSend}
                disabled={isSending || !input.trim()}
                aria-label="Send"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

