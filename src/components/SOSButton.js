'use client';

import { useState, useRef } from 'react';

const HOLD_DURATION = 3000; // 3 seconds to prevent accidental triggers

export default function SOSButton({ onPress, onRelease }) {
  const [holdProgress, setHoldProgress] = useState(0); // 0–100
  const [triggered, setTriggered] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const startHold = (e) => {
    e.preventDefault();
    if (triggered) return;
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(intervalRef.current);
        setTriggered(true);
        onPress && onPress();
      }
    }, 30);
  };

  const cancelHold = () => {
    clearInterval(intervalRef.current);
    if (!triggered) {
      setHoldProgress(0);
      onRelease && onRelease();
    }
  };

  // Circumference of the SVG ring
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (holdProgress / 100) * circumference;

  return (
    <div className="flex flex-col items-center mb-4">
      <button
        className="relative group select-none touch-none"
        onMouseDown={startHold}
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
        onTouchStart={startHold}
        onTouchEnd={cancelHold}
        aria-label="SOS Emergency Button — Hold for 3 seconds"
        style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
      >
        {/* SVG Progress Ring */}
        <svg
          className="absolute inset-0 -rotate-90"
          width="96"
          height="96"
          viewBox="0 0 120 120"
        >
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(255,77,77,0.2)"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={triggered ? '#22c55e' : '#ff4d4d'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.03s linear, stroke 0.3s ease' }}
          />
        </svg>

        {/* SOS Button Core */}
        <div
          className="size-24 rounded-full flex flex-col items-center justify-center text-white z-10 relative transition-all duration-300"
          style={{
            background: triggered ? '#22c55e' : '#ff4d4d',
            boxShadow: triggered
              ? '0 0 30px rgba(34,197,94,0.6)'
              : holdProgress > 0
              ? '0 0 40px rgba(255,77,77,0.8)'
              : '0 0 20px rgba(255,77,77,0.4)',
            transform: `scale(${triggered ? 1.05 : holdProgress > 0 ? 0.95 : 1})`,
          }}
        >
          {triggered ? (
            <>
              <span className="material-symbols-outlined text-2xl">check_circle</span>
              <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">Sent!</span>
            </>
          ) : holdProgress > 0 ? (
            <>
              <span className="text-xl font-black">{Math.ceil((HOLD_DURATION - (holdProgress / 100) * HOLD_DURATION) / 1000)}s</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Hold!</span>
            </>
          ) : (
            <>
              <span className="text-xs font-bold uppercase tracking-widest opacity-80 mb-0.5">Hold for</span>
              <span className="text-2xl font-black">SOS</span>
            </>
          )}
        </div>

        {/* Pulse animation when idle */}
        {!triggered && holdProgress === 0 && (
          <div className="absolute inset-0 rounded-full bg-[#ff4d4d] opacity-20 animate-ping pointer-events-none" />
        )}
      </button>

      {/* Status label */}
      <p className="text-[10px] text-slate-400 mt-2 font-medium">
        {triggered ? 'Alerts dispatched!' : holdProgress > 0 ? 'Keep holding...' : 'Hold 3s for SOS'}
      </p>
    </div>
  );
}
