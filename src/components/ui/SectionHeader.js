'use client';

export default function SectionHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        {subtitle ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        ) : null}
      </div>
      {right ? <div className="flex items-center gap-3">{right}</div> : null}
    </div>
  );
}

