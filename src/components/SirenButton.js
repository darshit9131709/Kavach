'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * SirenButton
 *
 * Toggle button that plays a loud emergency siren sound.
 * - Plays /public/sounds/siren.mp3 on loop
 * - Visual pulsing red indicator when active
 * - Toggle ON/OFF
 */
export default function SirenButton({ className = '' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  const toggleSiren = useCallback(() => {
    if (isPlaying) {
      // Stop siren
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    } else {
      // Start siren
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio('/sounds/siren.wav');
          audioRef.current.loop = true;
        }
        audioRef.current.volume = 1.0;
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => {
          console.error('[Siren] Playback error:', err);
        });
        setIsPlaying(true);
      } catch (e) {
        console.error('[Siren] Could not load audio:', e);
      }
    }
  }, [isPlaying]);

  return (
    <button
      onClick={toggleSiren}
      className={`relative bg-white dark:bg-slate-800 p-4 rounded-xl flex flex-col items-center gap-2 shadow-sm border transition-all active:scale-95 ${
        isPlaying
          ? 'border-red-400 bg-red-50 dark:bg-red-900/20 siren-active-glow'
          : 'border-slate-100 dark:border-slate-700 active:bg-[#8b47eb]/5'
      } ${className}`}
    >
      {/* Pulsing indicator when playing */}
      {isPlaying && (
        <div className="absolute top-2 right-2">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
          </span>
        </div>
      )}

      <span
        className={`material-symbols-outlined text-3xl transition-colors ${
          isPlaying ? 'text-red-500' : 'text-[#8b47eb]'
        }`}
      >
        {isPlaying ? 'volume_off' : 'volume_up'}
      </span>
      <span
        className={`text-xs font-bold transition-colors ${
          isPlaying ? 'text-red-600 dark:text-red-400' : ''
        }`}
      >
        {isPlaying ? 'Stop Siren' : 'Fake Siren'}
      </span>
    </button>
  );
}
