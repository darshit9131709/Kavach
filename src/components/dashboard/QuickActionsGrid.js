'use client';

import QuickActionCard from './QuickActionCard';

const defaultActions = [
  {
    icon: 'share_location',
    title: 'Share Location',
    description: 'Real-time tracking',
    iconBgColor: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    hoverBgColor: 'group-hover:bg-blue-100',
  },
  {
    icon: 'call',
    title: 'Fake Call',
    description: 'Trigger an incoming call',
    iconBgColor: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-[#8b47eb]',
    hoverBgColor: 'group-hover:bg-purple-100',
  },
  {
    icon: 'emergency',
    title: 'Contact Police',
    description: 'Direct dial local 112',
    iconBgColor: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
    hoverBgColor: 'group-hover:bg-orange-100',
  },
  {
    icon: 'health_and_safety',
    title: 'Safe Places',
    description: 'Find nearby help',
    iconBgColor: 'bg-teal-50 dark:bg-teal-900/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    hoverBgColor: 'group-hover:bg-teal-100',
  },
];

export default function QuickActionsGrid({ 
  actions = defaultActions,
  onActionClick,
  onViewAll 
}) {
  const handleActionClick = (action, index) => {
    if (onActionClick) {
      onActionClick(action, index);
    } else {
      // Default handler - can be overridden
      console.log('Action clicked:', action.title);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Quick Actions
        </h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-[#8b47eb] text-sm font-semibold"
          >
            View All
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <QuickActionCard
            key={index}
            {...action}
            onClick={() => handleActionClick(action, index)}
          />
        ))}
      </div>
    </section>
  );
}
