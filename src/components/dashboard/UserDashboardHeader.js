'use client';

import Image from 'next/image';

export default function UserDashboardHeader({ 
  userName = 'Aditi',
  safetyStatus = 'Secure',
  onNotificationClick 
}) {
  return (
    <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-[#f7f6f8]/80 dark:bg-[#181121]/80 backdrop-blur-md z-30">
      <div className="flex items-center gap-3">
        <div className="size-12 rounded-full overflow-hidden border-2 border-[#8b47eb]/20">
          <Image
            alt="User Profile Avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM1X-nNCueGFCP8PGvwITGzLllmZwoFd0pXSZ2rAssWiff1hhMO0LUgYnStHk-y1eeY-a58SJZmgcGvzhzWHD-r26XPlt-yAUD6SecUdZuwTpDCpGd_Y_LAkk7AQ2mYOeSmfUdgMjKMr8wLEu2PMeye16AGc51oP62REO391n8LXxniqzuPMBt8QfPKbpFVBlwVhwbtsyV8V3HAOqbNZrCqwddbKkUyOLpfX_uHfaxwmLVVIf_M-lytRLRBhTPghx0sc_iv5hfQu0"
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Hello, {userName}</h1>
          <p className="text-xs text-[#8b47eb] font-medium flex items-center gap-1">
            <span className="size-2 bg-green-500 rounded-full inline-block"></span>
            Safety Status: {safetyStatus}
          </p>
        </div>
      </div>
      <button
        onClick={onNotificationClick}
        className="size-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        <span className="material-symbols-outlined">notifications</span>
      </button>
    </header>
  );
}
