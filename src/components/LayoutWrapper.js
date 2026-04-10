'use client';

import { useSession } from 'next-auth/react';
import Navbar from './Navbar';
import BottomNavigation from './BottomNavigation';
import SOSButton from './SOSButton';
import BackgroundDecoration from './BackgroundDecoration';

export default function LayoutWrapper({ children }) {
  const { data: session } = useSession();

  const handleSOSPress = async () => {
    if (!session?.user) {
      console.warn('[SOS] No active session. Cannot trigger alert.');
      return;
    }

    try {
      console.log('[SOS] Hold complete — dispatching emergency alerts...');
      const response = await fetch('/api/sos/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[SOS] Failed to dispatch alerts:', data);
        alert(`SOS Failed: ${data.message || data.error}`);
        return;
      }

      console.log(`[SOS] ✅ Success — ${data.message}`);
    } catch (err) {
      console.error('[SOS] Network error while dispatching SOS:', err);
      alert('SOS alert could not be sent. Please check your internet connection.');
    }
  };

  return (
    <div className="bg-[#f7f6f8] dark:bg-[#181121] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <BackgroundDecoration />
      <Navbar />
      <main className="flex-1 px-6 pb-40">{children}</main>
      {/* Bottom Navigation & Floating SOS Button */}
      <div className="fixed bottom-0 inset-x-0 z-50">
        {/* Semi-transparent gradient background */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f7f6f8] dark:from-[#181121] to-transparent pointer-events-none"></div>
        <div className="relative px-6 pb-8">
          {/* Large Red SOS Button */}
          <SOSButton onPress={handleSOSPress} />
          {/* Main Bottom Nav Bar */}
          <BottomNavigation />
        </div>
      </div>
    </div>
  );
}
