'use client';

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="size-8 rounded-full bg-primary/5 flex-shrink-0 flex items-center justify-center opacity-50">
        <span className="material-symbols-outlined text-primary text-sm">
          smart_toy
        </span>
      </div>
      <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-full flex items-center">
        <span className="size-1 rounded-full bg-primary inline-block mr-1 animate-bounce"></span>
        <span
          className="size-1 rounded-full bg-primary inline-block mr-1 animate-bounce"
          style={{ animationDelay: '0.2s' }}
        ></span>
        <span
          className="size-1 rounded-full bg-primary inline-block animate-bounce"
          style={{ animationDelay: '0.4s' }}
        ></span>
      </div>
    </div>
  );
}

