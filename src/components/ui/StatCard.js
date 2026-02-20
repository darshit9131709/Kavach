'use client';

export default function StatCard({ label, value, sub, icon, iconBg }) {
  return (
    <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-slate-100 tracking-tight">
          {value}
        </h3>
        {sub ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {sub}
          </p>
        ) : null}
      </div>
      <div className={`${iconBg} p-3 rounded-lg`}>
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
    </div>
  );
}

