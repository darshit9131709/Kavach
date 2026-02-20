'use client';

import { useState, useEffect, useCallback } from 'react';

export default function EmergencySOSButton({ onHoldComplete, onError }) {
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  const handleSOSSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setSuccess(false);

    try {
      // Get user's current location
      const location = await getCurrentLocation();

      // Call SOS API
      const response = await fetch('/api/sos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send SOS alert');
      }

      // Success
      setSuccess(true);
      setIsSubmitting(false);

      if (onHoldComplete) {
        onHoldComplete(data);
      }

      // Reset success state after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('SOS error:', error);
      setIsSubmitting(false);
      setHoldProgress(0);

      if (onError) {
        onError(error.message || 'Failed to send SOS alert. Please try again.');
      }
    }
  }, [getCurrentLocation, onHoldComplete, onError]);

  useEffect(() => {
    let interval = null;
    if (isHolding && holdProgress < 100 && !isSubmitting) {
      interval = setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            setIsHolding(false);
            handleSOSSubmit();
            return 0;
          }
          return prev + (100 / 30); // 3 seconds = 30 intervals of 100ms
        });
      }, 100);
    } else if (!isHolding) {
      setHoldProgress(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHolding, holdProgress, isSubmitting, handleSOSSubmit]);

  const handleMouseDown = () => {
    if (!isSubmitting && !success) {
      setIsHolding(true);
    }
  };

  const handleMouseUp = () => {
    setIsHolding(false);
    if (holdProgress < 100) {
      setHoldProgress(0);
    }
  };

  const handleTouchStart = () => {
    if (!isSubmitting && !success) {
      setIsHolding(true);
    }
  };

  const handleTouchEnd = () => {
    setIsHolding(false);
    if (holdProgress < 100) {
      setHoldProgress(0);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center py-8">
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        disabled={isSubmitting || success}
        className={`sos-glow relative size-48 rounded-full flex flex-col items-center justify-center text-white active:scale-95 transition-transform ${
          success
            ? 'bg-green-500'
            : isSubmitting
            ? 'bg-orange-500'
            : 'bg-[#ef4444]'
        } ${isSubmitting || success ? 'cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? (
          <>
            <span className="material-symbols-outlined text-6xl mb-1 animate-spin">
              sync
            </span>
            <span className="font-bold text-lg tracking-wider">SENDING...</span>
          </>
        ) : success ? (
          <>
            <span className="material-symbols-outlined text-6xl mb-1">check_circle</span>
            <span className="font-bold text-lg tracking-wider">SENT!</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-6xl mb-1">emergency_home</span>
            <span className="font-bold text-lg tracking-wider">HOLD FOR SOS</span>
          </>
        )}
        {isHolding && !isSubmitting && !success && (
          <div
            className="absolute inset-0 rounded-full border-4 border-white/50"
            style={{ clipPath: `inset(${100 - holdProgress}% 0 0 0)` }}
          ></div>
        )}
        <div className="absolute -inset-4 border-2 border-[#ef4444]/30 rounded-full"></div>
      </button>
      <p className="mt-8 text-sm text-slate-500 text-center px-8">
        {success
          ? 'SOS alert sent! Your trusted contacts and authorities have been notified.'
          : isSubmitting
          ? 'Sending SOS alert...'
          : 'Holding this button for 3 seconds will alert your trusted contacts and local authorities.'}
      </p>
    </section>
  );
}
