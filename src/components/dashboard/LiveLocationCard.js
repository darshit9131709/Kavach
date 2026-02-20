'use client';

export default function LiveLocationCard({ 
  location = 'Mumbai',
  isTrackingEnabled = false,
  onToggleTracking,
  onViewMap,
  lastUpdate = null
}) {
  const formatLastUpdate = (date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // Difference in seconds
    
    if (diff < 60) {
      return 'Just now';
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      const hours = Math.floor(diff / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="h-40 bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuChENV5ylNW34csRr8JZb4i-0A0WDp2Mof3jZjCFQoypDbK4f9Pz_nrq4vY1kwlEftQN-BsxGB0IC6SJths7yti8rd_g46C908Aq0WlQycaSjuygJ681X7Hhram9VUV-Dt_yzblupBL-9QVQ96C5sA93XLuA3OlN4HVkuxmUZyL7lvHUQWRlIUfyFUJGwoCFcIt8iBZLceNfPzRu5VuvQ4968rE1bQvF7X9cCPurynHU8DmK0vuEkpJ3qP9OMIcMWev45oUfZDxNU4')`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`size-6 bg-[#8b47eb] rounded-full border-4 border-white shadow-lg ${isTrackingEnabled ? 'animate-bounce' : ''}`}></div>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100">
            Live Location Sharing
          </h3>
          <p className="text-xs text-slate-500">
            Real-time tracking is currently {isTrackingEnabled ? 'ON' : 'OFF'}
            {lastUpdate && isTrackingEnabled && (
              <span className="block mt-0.5">Last update: {formatLastUpdate(lastUpdate)}</span>
            )}
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isTrackingEnabled}
            onChange={onToggleTracking}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8b47eb]"></div>
        </label>
      </div>
    </section>
  );
}
