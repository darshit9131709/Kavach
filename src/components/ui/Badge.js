'use client';

export default function Badge({ tone = 'slate', children, className = '' }) {
  const tones = {
    slate:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    green:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    amber:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    purple:
      'bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        tones[tone] || tones.slate
      } ${className}`}
    >
      {children}
    </span>
  );
}

