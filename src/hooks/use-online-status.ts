"use client";

import { useEffect, useRef, useState } from "react";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkConnection = async () => {
    try {
      await fetch("https://ipify.org", {
        method: "GET",
        cache: "no-store",
        mode: "no-cors",
      });
      setIsOnline(true);
    } catch {
      setIsOnline(false);
    }
  };

  useEffect(() => {
    checkConnection();

    const handleOffline = () => setIsOnline(false);
    const handleOnline = () => checkConnection();

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    intervalRef.current = setInterval(checkConnection, 5000);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);

      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return isOnline;
}
