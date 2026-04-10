"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";

// ✅ Global lock to prevent multiple hook instances
let globalTrackingActive = false;

export function useLocationTracking(enabled = false, onError, onSuccess) {
  const { data: session } = useSession();

  const watchIdRef = useRef(null);
  const lastSentRef = useRef(0);
  const isSendingRef = useRef(false);

  const sendLocation = useCallback(
    async (latitude, longitude) => {
      const now = Date.now();

      // ✅ Prevent parallel API calls
      if (isSendingRef.current) return;

      // ✅ Throttle (10 sec)
      if (now - lastSentRef.current < 10000) return;

      if (!session?.user?.id) return;

      try {
        isSendingRef.current = true;

        const response = await fetch("/api/location", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude,
            longitude,
            timestamp: now,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update location");
        }

        lastSentRef.current = now;

        if (onSuccess) onSuccess(data);
      } catch (error) {
        console.error("Location update error:", error);
        if (onError) onError(error.message);
      } finally {
        isSendingRef.current = false;
      }
    },
    [session, onError, onSuccess],
  );

  useEffect(() => {
    if (!enabled || !navigator.geolocation || !session?.user?.id) {
      return;
    }

    // 🚨 Prevent multiple instances running
    if (globalTrackingActive) return;
    globalTrackingActive = true;

    let isActive = true;

    console.log("✅ Location tracking started");

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        if (!isActive) return;

        const { latitude, longitude } = position.coords;

        sendLocation(latitude, longitude);
      },
      (error) => {
        if (!isActive) return;

        console.error("Geolocation error:", error);

        if (onError) {
          let errorMessage = "Failed to get location";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location permission denied. Please enable location access.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location timeout.";
              break;
          }

          onError(errorMessage);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      },
    );

    return () => {
      console.log("🛑 Location tracking stopped");

      isActive = false;

      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      globalTrackingActive = false; // 🔓 release lock
    };
  }, [enabled, session, sendLocation, onError]);
}
