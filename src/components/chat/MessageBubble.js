'use client';

export default function MessageBubble({ role, text, time }) {
  const isUser = role === 'user';

  if (isUser) {
    return (
      <div className="flex items-end gap-2 justify-end ml-auto max-w-[85%]">
        <div className="flex flex-col gap-1 items-end">
          <div className="bg-primary text-white p-3 rounded-2xl rounded-br-none shadow-md shadow-primary/20">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
          </div>
          {time ? (
            <span className="text-[10px] text-slate-400 mr-1">{time}</span>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 max-w-[85%]">
      <div className="size-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-[18px]">
          smart_toy
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="bg-primary/5 dark:bg-primary/10 text-slate-800 dark:text-slate-200 p-3 rounded-2xl rounded-bl-none border border-primary/10 shadow-sm">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
        </div>
        {time ? (
          <span className="text-[10px] text-slate-400 ml-1">{time}</span>
        ) : null}
      </div>
    </div>
  );
}

