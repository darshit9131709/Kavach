'use client';

export default function DataTableShell({ title, subtitle, headerRight, children }) {
  return (
    <section className="bg-white dark:bg-slate-900/70 rounded-xl border border-primary/10 shadow-sm overflow-hidden">
      {(title || subtitle || headerRight) ? (
        <div className="p-6 border-b border-primary/10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            {title ? <h3 className="text-lg font-bold">{title}</h3> : null}
            {subtitle ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            ) : null}
          </div>
          {headerRight ? <div className="flex items-center gap-3">{headerRight}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

