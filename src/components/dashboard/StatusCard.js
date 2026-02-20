'use client';

/**
 * StatusCard
 * Reusable status summary card for safety/health indicators.
 */
export default function StatusCard({
  status = 'Protected',
  title = 'You are safe',
  location = 'New Delhi',
  lastSync = 'Just now',
  icon = 'verified_user',
  accentColor = '#2ecc71',
  onPrimaryAction,
  onSecondaryAction,
  primaryActionLabel = 'View Map',
  secondaryActionLabel = 'Signal Strength',
}) {
  return (
    <section className="mt-4 mb-8">
      <div
        className="relative overflow-hidden rounded-2xl border p-6 soft-shadow"
        style={{
          backgroundColor: `${accentColor}1A`, // ~10% opacity
          borderColor: `${accentColor}33`, // ~20% opacity
        }}
      >
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ backgroundColor: accentColor }}
                />
                <span
                  className="relative inline-flex h-3 w-3 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
              </span>
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: accentColor }}
              >
                Status: {status}
              </span>
            </div>
            <h2 className="mb-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Last location sync: {lastSync} • {location}
            </p>
          </div>
          {icon && (
            <div className="hidden sm:block">
              <span
                className="material-symbols-outlined text-6xl opacity-20"
                style={{ color: accentColor }}
              >
                {icon}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={onPrimaryAction}
            className="flex-1 border border-slate-100 bg-white py-3 text-sm font-semibold shadow-sm transition-transform active:scale-95 dark:border-slate-700 dark:bg-slate-800 flex items-center justify-center gap-2 rounded-xl"
          >
            <span className="material-symbols-outlined text-xl text-[#8b47eb]">
              map
            </span>
            {primaryActionLabel}
          </button>
          <button
            type="button"
            onClick={onSecondaryAction}
            className="flex-1 border border-slate-100 bg-white py-3 text-sm font-semibold shadow-sm transition-transform active:scale-95 dark:border-slate-700 dark:bg-slate-800 flex items-center justify-center gap-2 rounded-xl"
          >
            <span className="material-symbols-outlined text-xl text-[#8b47eb]">
              settings_input_antenna
            </span>
            {secondaryActionLabel}
          </button>
        </div>
      </div>
    </section>
  );
}

