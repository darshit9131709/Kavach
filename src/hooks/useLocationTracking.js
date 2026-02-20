'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Custom hook for live location tracking
 * Sends location updates to the server every 10 seconds
 * 
 * @param {boolean} enabled - Whether location tracking is enabled
 * @param {Function} onError - Callback for errors
 * @param {Function} onSuccess - Callback for successful updates
 */
export function useLocationTracking(enabled = false, onError, onSuccess) {
  const { data: session } = useSession();
  const watchIdRef = useRef(null);
  const intervalRef = useRef(null);
  const lastSentRef = useRef(null);

  const sendLocation = useCallback(
    async (latitude, longitude) => {
      // Prevent sending duplicate locations within 10 seconds
      const now = Date.now();
      if (lastSentRef.current && now - lastSentRef.current < 10000) {
        return;
      }

      if (!session?.user?.id) {
        return;
      }

      try {
        const response = await fetch('/api/location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude,
            longitude,
            timestamp: now,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to update location');
        }

        lastSentRef.current = now;

        if (onSuccess) {
          onSuccess(data);
        }
      } catch (error) {
        console.error('Location update error:', error);
        if (onError) {
          onError(error.message || 'Failed to update location');
        }
      }
    },
    [session, onError, onSuccess]
  );

  useEffect(() => {
    if (!enabled || !navigator.geolocation || !session?.user?.id) {
      // Cleanup if disabled or no session
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    let isActive = true;

    // Watch position for continuous updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        if (!isActive) return;

        const { latitude, longitude } = position.coords;

        // Send location immediately on first update
        if (!lastSentRef.current) {
          sendLocation(latitude, longitude);
        }
      },
      (error) => {
        if (!isActive) return;
        console.error('Geolocation error:', error);
        if (onError) {
          let errorMessage = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          onError(errorMessage);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000, // Accept cached position up to 5 seconds old
      }
    );

    // Set up interval to send location every 10 seconds
    intervalRef.current = setInterval(() => {
      if (!isActive) return;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          sendLocation(latitude, longitude);
        },
        (error) => {
          console.error('Interval geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }, 10000); // Send every 10 seconds

    // Cleanup function
    return () => {
      isActive = false;

      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      lastSentRef.current = null;
    };
  }, [enabled, session, sendLocation, onError]);
}
