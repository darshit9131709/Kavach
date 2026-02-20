'use client';

const HELPLINES = [
  {
    name: 'Police',
    description: 'Immediate local assistance',
    number: '100',
    icon: 'local_police',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600',
  },
  {
    name: 'Women Helpline',
    description: '24/7 Dedicated Support',
    number: '1091',
    icon: 'woman',
    iconBg: 'bg-pink-100 dark:bg-pink-900/30',
    iconColor: 'text-pink-600',
  },
];

export default function HelplineDirectory() {
  const handleCall = (number) => {
    // TODO: Implement call functionality
    console.log('Calling:', number);
    window.location.href = `tel:${number}`;
  };

  return (
    <section className="space-y-3">
      <h3 className="font-bold text-slate-900 dark:text-slate-100 px-1">
        Helpline Directory
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {HELPLINES.map((helpline) => (
          <div
            key={helpline.number}
            className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center gap-3">
              <div
                className={`size-10 rounded-full ${helpline.iconBg} flex items-center justify-center ${helpline.iconColor}`}
              >
                <span className="material-symbols-outlined">{helpline.icon}</span>
              </div>
              <div>
                <p className="text-sm font-bold">{helpline.name}</p>
                <p className="text-[10px] text-slate-500">{helpline.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleCall(helpline.number)}
              className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              {helpline.number}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
