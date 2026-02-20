'use client';

export default function SOSButton({ onPress, onRelease }) {
  return (
    <div className="flex flex-col items-center mb-4">
      <button
        className="relative group active:scale-90 transition-transform duration-150"
        onMouseDown={onPress}
        onMouseUp={onRelease}
        onTouchStart={onPress}
        onTouchEnd={onRelease}
        aria-label="SOS Emergency Button"
      >
        {/* SOS Button Core */}
        <div className="size-24 bg-[#ff4d4d] rounded-full flex flex-col items-center justify-center text-white soft-shadow sos-glow z-10 relative">
          <span className="text-xs font-bold uppercase tracking-widest opacity-80 mb-0.5">
            Hold for
          </span>
          <span className="text-2xl font-black">SOS</span>
        </div>
        {/* Pulses (Visual Decoration) */}
        <div className="absolute inset-0 rounded-full bg-[#ff4d4d] opacity-20 animate-ping"></div>
      </button>
    </div>
  );
}
