'use client';

export default function QuickActionCard({ 
  icon, 
  title, 
  description, 
  iconBgColor = 'bg-blue-50 dark:bg-blue-900/20',
  iconColor = 'text-blue-600 dark:text-blue-400',
  hoverBgColor = 'group-hover:bg-blue-100',
  onClick 
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 soft-shadow flex flex-col gap-4 group cursor-pointer active:scale-95 transition-all"
    >
      <div className={`size-12 rounded-xl ${iconBgColor} flex items-center justify-center ${hoverBgColor} transition-colors`}>
        <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
      </div>
      <div>
        <p className="font-bold text-slate-900 dark:text-slate-100 text-base leading-tight">
          {title}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  );
}
