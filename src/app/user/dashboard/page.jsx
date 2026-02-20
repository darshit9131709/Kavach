"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import UserDashboardHeader from "@/components/dashboard/UserDashboardHeader";
import EmergencySOSButton from "@/components/dashboard/EmergencySOSButton";
import LiveLocationCard from "@/components/dashboard/LiveLocationCard";
import HelplineDirectory from "@/components/dashboard/HelplineDirectory";
import SafetyStore from "@/components/dashboard/SafetyStore";

export default function UserDashboardPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);
  const [sosError, setSosError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [lastLocationUpdate, setLastLocationUpdate] = useState(null);
  const [trustedContacts, setTrustedContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);

  const isActive = (path) => pathname === path;

  // ✅ Dynamic name from session
  const userName = session?.user?.name?.split(" ")[0] || "User";

  useLocationTracking(
    isTrackingEnabled && !!session,
    (error) => {
      setLocationError(error);
      setTimeout(() => setLocationError(""), 5000);
    },
    (data) => {
      setLastLocationUpdate(new Date());
      setLocationError("");
      console.log("Location updated:", data);
    },
  );

  useEffect(() => {
    fetchTrustedContacts();
  }, []);

  const fetchTrustedContacts = async () => {
    try {
      setContactsLoading(true);
      const response = await fetch("/api/trusted-contacts");
      const data = await response.json();
      if (response.ok) {
        setTrustedContacts(data.contacts || []);
      }
    } catch (err) {
      console.error("Fetch contacts error:", err);
    } finally {
      setContactsLoading(false);
    }
  };

  useEffect(() => {
    if (!session) setIsTrackingEnabled(false);
  }, [session]);

  useEffect(() => {
    const handleBeforeUnload = () => setIsTrackingEnabled(false);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      setIsTrackingEnabled(false);
    };
  }, []);

  const handleSOSComplete = (data) => {
    console.log("SOS alert sent successfully:", data);
    setSosError("");
  };

  const handleSOSError = (errorMessage) => {
    console.error("SOS error:", errorMessage);
    setSosError(errorMessage);
    setTimeout(() => setSosError(""), 5000);
  };

  const handleToggleTracking = () => {
    const newState = !isTrackingEnabled;
    setIsTrackingEnabled(newState);

    if (newState) {
      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by your browser");
        setIsTrackingEnabled(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationError("");
        },
        (error) => {
          setIsTrackingEnabled(false);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError(
                "Location permission denied. Please enable it in browser settings.",
              );
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information unavailable.");
              break;
            case error.TIMEOUT:
              setLocationError("Location request timed out.");
              break;
            default:
              setLocationError("Failed to enable location tracking.");
          }
        },
      );
    } else {
      setLocationError("");
    }
  };

  const handleContactClick = (contact) => {
    window.location.href = `tel:${contact.phone}`;
  };

  return (
    <div className="bg-[#f7f6f8] dark:bg-[#181121] font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      {/* ✅ Pass dynamic userName from session */}
      <UserDashboardHeader
        userName={userName}
        safetyStatus="Secure"
        onNotificationClick={() => console.log("Notifications clicked")}
      />

      <main className="flex-1 px-4 pb-24 max-w-md mx-auto w-full space-y-6">
        {/* Error Messages */}
        {(sosError || locationError) && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-lg">
              error
            </span>
            <p className="text-sm text-red-600 dark:text-red-400 flex-1">
              {sosError || locationError}
            </p>
            <button
              onClick={() => {
                setSosError("");
                setLocationError("");
              }}
              className="text-red-600 dark:text-red-400 hover:text-red-700"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        )}

        {/* Emergency SOS Button — only one, here in main content */}
        <EmergencySOSButton
          onHoldComplete={handleSOSComplete}
          onError={handleSOSError}
        />

        {/* Live Location Card */}
        <LiveLocationCard
          location="Mumbai"
          isTrackingEnabled={isTrackingEnabled}
          onToggleTracking={handleToggleTracking}
          onViewMap={() => router.push("/user/map")}
          lastUpdate={lastLocationUpdate}
        />

        {/* Trusted Contacts */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">
              Trusted Contacts
            </h3>
            <button
              onClick={() => router.push("/user/contacts")}
              className="text-xs font-semibold text-[#8b47eb] hover:underline"
            >
              Manage
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar py-2 px-1">
            <button
              onClick={() => router.push("/user/contacts")}
              className="flex-shrink-0 flex flex-col items-center gap-2"
            >
              <div className="size-14 rounded-full border-2 border-dashed border-[#8b47eb]/40 flex items-center justify-center text-[#8b47eb]">
                <span className="material-symbols-outlined">add</span>
              </div>
              <span className="text-[10px] font-medium">Add New</span>
            </button>

            {contactsLoading ? (
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <div className="size-14 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <span className="text-[10px] font-medium text-slate-400">
                  Loading...
                </span>
              </div>
            ) : (
              trustedContacts.slice(0, 4).map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleContactClick(contact)}
                  className="flex-shrink-0 flex flex-col items-center gap-2"
                >
                  <div className="size-14 rounded-full bg-[#8b47eb]/10 border-2 border-[#8b47eb]/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#8b47eb] text-2xl">
                      person
                    </span>
                  </div>
                  <span className="text-[10px] font-medium truncate max-w-[56px]">
                    {contact.name}
                  </span>
                </button>
              ))
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-3 gap-3">
          <button
            onClick={() => console.log("Fake call triggered")}
            className="bg-white dark:bg-slate-800 p-4 rounded-xl flex flex-col items-center gap-2 shadow-sm border border-slate-100 dark:border-slate-700 active:bg-[#8b47eb]/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[#8b47eb] text-3xl">
              phone_callback
            </span>
            <span className="text-xs font-bold">Fake Call</span>
          </button>
          <button
            onClick={() => console.log("Fake siren triggered")}
            className="bg-white dark:bg-slate-800 p-4 rounded-xl flex flex-col items-center gap-2 shadow-sm border border-slate-100 dark:border-slate-700 active:bg-[#8b47eb]/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[#8b47eb] text-3xl">
              volume_up
            </span>
            <span className="text-xs font-bold">Fake Siren</span>
          </button>
          <button
            onClick={() => router.push("/user/chat")}
            className="bg-[#8b47eb] p-4 rounded-xl flex flex-col items-center gap-2 shadow-sm border border-[#8b47eb]/20 text-white hover:bg-[#8b47eb]/90 transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">
              smart_toy
            </span>
            <span className="text-xs font-bold">Arya AI</span>
          </button>
        </section>

        <HelplineDirectory />
        <SafetyStore onViewAll={() => router.push("/user/store")} />
      </main>

      {/* ✅ Bottom Nav — SOS removed, replaced with Map */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-6 py-3 z-50">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <Link
            href="/user/dashboard"
            className={`flex flex-col items-center gap-1 ${isActive("/user/dashboard") ? "text-[#8b47eb]" : "text-slate-400 dark:text-slate-500"}`}
          >
            <span className="material-symbols-outlined">home</span>
            <span
              className={`text-[10px] ${isActive("/user/dashboard") ? "font-bold" : "font-medium"}`}
            >
              Home
            </span>
          </Link>
          <Link
            href="/user/map"
            className={`flex flex-col items-center gap-1 ${isActive("/user/map") ? "text-[#8b47eb]" : "text-slate-400 dark:text-slate-500"}`}
          >
            <span className="material-symbols-outlined">map</span>
            <span
              className={`text-[10px] ${isActive("/user/map") ? "font-bold" : "font-medium"}`}
            >
              Map
            </span>
          </Link>
          <Link
            href="/user/chat"
            className={`flex flex-col items-center gap-1 ${isActive("/user/chat") ? "text-[#8b47eb]" : "text-slate-400 dark:text-slate-500"}`}
          >
            <span className="material-symbols-outlined">chat_bubble</span>
            <span
              className={`text-[10px] ${isActive("/user/chat") ? "font-bold" : "font-medium"}`}
            >
              Chat
            </span>
          </Link>
          <Link
            href="/user/store"
            className={`flex flex-col items-center gap-1 ${isActive("/user/store") ? "text-[#8b47eb]" : "text-slate-400 dark:text-slate-500"}`}
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            <span
              className={`text-[10px] ${isActive("/user/store") ? "font-bold" : "font-medium"}`}
            >
              Store
            </span>
          </Link>
          <Link
            href="/user/profile"
            className={`flex flex-col items-center gap-1 ${isActive("/user/profile") ? "text-[#8b47eb]" : "text-slate-400 dark:text-slate-500"}`}
          >
            <span className="material-symbols-outlined">account_circle</span>
            <span
              className={`text-[10px] ${isActive("/user/profile") ? "font-bold" : "font-medium"}`}
            >
              Profile
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
