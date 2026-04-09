'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * FakeCallOverlay
 *
 * Full-screen overlay that simulates a realistic incoming phone call.
 * - Configurable caller name & avatar
 * - Plays ringtone audio on loop
 * - Accept → plays pre-recorded voice, shows "on call" UI
 * - Reject → dismisses overlay
 */
export default function FakeCallOverlay({
  callerName = 'Mom',
  callerSubtext = 'Mobile',
  onDismiss,
  visible = false,
}) {
  const [callState, setCallState] = useState('ringing'); // 'ringing' | 'connected' | 'ended'
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const ringtoneRef = useRef(null);
  const voiceRef = useRef(null);
  const timerRef = useRef(null);

  // Get caller initials for avatar
  const initials = callerName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Avatar background colors based on caller name
  const avatarColors = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-rose-500 to-pink-500',
    'from-amber-500 to-orange-500',
  ];
  const colorIndex =
    callerName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    avatarColors.length;

  // Format call duration as mm:ss
  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Play ringtone when visible and ringing
  useEffect(() => {
    if (visible && callState === 'ringing') {
      try {
        ringtoneRef.current = new Audio('/sounds/ringtone.wav');
        ringtoneRef.current.loop = true;
        ringtoneRef.current.volume = 1.0;
        ringtoneRef.current.play().catch(() => {
          // Autoplay may be blocked — user interaction will unblock it
          console.log('[FakeCall] Ringtone autoplay blocked');
        });
      } catch (e) {
        console.log('[FakeCall] Could not load ringtone:', e);
      }
    }

    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current.currentTime = 0;
        ringtoneRef.current = null;
      }
    };
  }, [visible, callState]);

  // Call duration timer
  useEffect(() => {
    if (callState === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [callState]);

  // Reset when visibility changes
  useEffect(() => {
    if (!visible) {
      setCallState('ringing');
      setCallDuration(0);
      setIsMuted(false);
      setIsSpeaker(false);
    }
  }, [visible]);

  const handleAccept = useCallback(() => {
    // Stop ringtone
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }

    setCallState('connected');

    // Play fake voice audio
    try {
      voiceRef.current = new Audio('/sounds/fake-voice.wav');
      voiceRef.current.volume = 1.0;
      voiceRef.current.play().catch(() => {
        console.log('[FakeCall] Voice autoplay blocked');
      });
    } catch (e) {
      console.log('[FakeCall] Could not load voice:', e);
    }
  }, []);

  const handleReject = useCallback(() => {
    // Stop all audio
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
    if (voiceRef.current) {
      voiceRef.current.pause();
      voiceRef.current.currentTime = 0;
    }

    setCallState('ended');

    // Dismiss after brief flash
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 300);
  }, [onDismiss]);

  const handleEndCall = useCallback(() => {
    if (voiceRef.current) {
      voiceRef.current.pause();
      voiceRef.current.currentTime = 0;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setCallState('ended');
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 300);
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col fake-call-overlay">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" />

      {/* Subtle animated bg blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center flex-1 pt-16 pb-12 px-8">
        {/* Top status bar */}
        <div className="w-full flex items-center justify-between mb-12 text-white/60 text-xs">
          <span>{callState === 'connected' ? 'On Call' : 'Incoming Call'}</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">signal_cellular_alt</span>
            <span className="material-symbols-outlined text-sm">wifi</span>
            <span className="material-symbols-outlined text-sm">battery_5_bar</span>
          </span>
        </div>

        {/* Caller Avatar */}
        <div className="relative mb-6">
          {/* Ringing pulse rings */}
          {callState === 'ringing' && (
            <>
              <div className={`absolute inset-[-12px] rounded-full bg-gradient-to-br ${avatarColors[colorIndex]} opacity-20 animate-ping`} />
              <div
                className={`absolute inset-[-24px] rounded-full bg-gradient-to-br ${avatarColors[colorIndex]} opacity-10 animate-ping`}
                style={{ animationDelay: '0.5s' }}
              />
            </>
          )}
          <div
            className={`relative w-28 h-28 rounded-full bg-gradient-to-br ${avatarColors[colorIndex]} flex items-center justify-center shadow-2xl`}
          >
            <span className="text-white text-4xl font-bold">{initials}</span>
          </div>
          {callState === 'connected' && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-slate-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-xs text-white">call</span>
            </div>
          )}
        </div>

        {/* Caller name */}
        <h2 className="text-white text-3xl font-bold mb-1">{callerName}</h2>
        <p className="text-white/50 text-sm mb-2">{callerSubtext}</p>

        {/* Call status */}
        {callState === 'ringing' && (
          <p className="text-green-400 text-sm font-medium fake-call-ringing-text">
            Incoming call...
          </p>
        )}
        {callState === 'connected' && (
          <p className="text-green-400 text-sm font-medium tabular-nums">
            {formatDuration(callDuration)}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* In-call controls (only when connected) */}
        {callState === 'connected' && (
          <div className="grid grid-cols-3 gap-8 mb-12 w-full max-w-xs">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? 'bg-white text-slate-900' : 'bg-white/10 text-white'
                }`}
              >
                <span className="material-symbols-outlined">
                  {isMuted ? 'mic_off' : 'mic'}
                </span>
              </div>
              <span className="text-white/60 text-xs">
                {isMuted ? 'Unmute' : 'Mute'}
              </span>
            </button>

            <button className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white">
                <span className="material-symbols-outlined">dialpad</span>
              </div>
              <span className="text-white/60 text-xs">Keypad</span>
            </button>

            <button
              onClick={() => setIsSpeaker(!isSpeaker)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isSpeaker ? 'bg-white text-slate-900' : 'bg-white/10 text-white'
                }`}
              >
                <span className="material-symbols-outlined">
                  {isSpeaker ? 'volume_up' : 'volume_down'}
                </span>
              </div>
              <span className="text-white/60 text-xs">
                {isSpeaker ? 'Speaker On' : 'Speaker'}
              </span>
            </button>
          </div>
        )}

        {/* Action buttons */}
        {callState === 'ringing' ? (
          <div className="flex items-center justify-center gap-16 w-full">
            {/* Reject */}
            <button
              onClick={handleReject}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30 active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-white text-3xl rotate-[135deg]">
                  call
                </span>
              </div>
              <span className="text-white/70 text-xs font-medium">Decline</span>
            </button>

            {/* Accept */}
            <button
              onClick={handleAccept}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30 active:scale-90 transition-transform fake-call-accept-bounce">
                <span className="material-symbols-outlined text-white text-3xl">
                  call
                </span>
              </div>
              <span className="text-white/70 text-xs font-medium">Accept</span>
            </button>
          </div>
        ) : callState === 'connected' ? (
          <button
            onClick={handleEndCall}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30 active:scale-90 transition-transform">
              <span className="material-symbols-outlined text-white text-3xl rotate-[135deg]">
                call
              </span>
            </div>
            <span className="text-white/70 text-xs font-medium">End Call</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
