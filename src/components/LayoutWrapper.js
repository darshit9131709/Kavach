'use client';

import Navbar from './Navbar';
import BottomNavigation from './BottomNavigation';
import SOSButton from './SOSButton';
import BackgroundDecoration from './BackgroundDecoration';

export default function LayoutWrapper({ children }) {
  const handleSOSPress = () => {
    // TODO: Implement SOS functionality
    console.log('SOS pressed');
  };

  const handleSOSRelease = () => {
    // TODO: Implement SOS release logic
    console.log('SOS released');
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
          <SOSButton onPress={handleSOSPress} onRelease={handleSOSRelease} />
          {/* Main Bottom Nav Bar */}
          <BottomNavigation />
        </div>
      </div>
    </div>
  );
}
