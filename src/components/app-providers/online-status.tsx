"use client";

import { useEffect, useRef, useState } from "react";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { WifiOff, Wifi } from "lucide-react";

export function OnlineStatus() {
  const isOnline = useOnlineStatus();
  const [showRestoredBanner, setShowRestoredBanner] = useState(false);
  const wasOfflineRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOnline === null) return;

    if (!isOnline) {
      wasOfflineRef.current = true;
      setShowRestoredBanner(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    } else if (wasOfflineRef.current) {
      setShowRestoredBanner(true);
      timerRef.current = setTimeout(() => {
        setShowRestoredBanner(false);
        wasOfflineRef.current = false;
      }, 3500); // Extended slightly so users can read the restored message
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOnline]);

  if (isOnline === null) return null;

  // Custom spring easing for premium feel
  const springEasing = "cubic-bezier(0.34, 1.56, 0.64, 1)";

  return (
    <>
      {/* Dimming overlay - Upgraded with desaturation and softer blur */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          backgroundColor: "rgba(0, 0, 0, 0.15)",
          backdropFilter: "blur(6px) saturate(0.5)",
          transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: isOnline ? 0 : 1,
          pointerEvents: isOnline ? "none" : "auto",
        }}
      />

      {/* Offline pill - Upgraded to dark glassmorphism */}
      <div
        role="status"
        aria-live="assertive"
        style={{
          position: "fixed",
          bottom: "2rem",
          left: "50%",
          transform: `translateX(-50%) translateY(${isOnline ? "2rem" : "0"}) scale(${isOnline ? 0.95 : 1})`,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.75rem 1.25rem",
          borderRadius: "9999px",
          background: "rgba(24, 24, 27, 0.85)", // Translucent dark
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          color: "#e4e4e7",
          fontSize: "0.875rem",
          fontWeight: 500,
          letterSpacing: "-0.01em",
          boxShadow: "0 20px 40px -8px rgba(0,0,0,0.5)",
          transition: `all 0.5s ${springEasing}`,
          opacity: isOnline ? 0 : 1,
          pointerEvents: isOnline ? "none" : "auto",
        }}
      >
        <div style={{ color: "#ef4444", display: "flex" }}>
          <WifiOff size={18} strokeWidth={2.5} />
        </div>
        <span>Connection lost. Waiting for network...</span>
        <span
          style={{
            position: "relative",
            display: "flex",
            height: 8,
            width: 8,
            marginLeft: "0.25rem",
          }}
        >
          <span
            style={{
              position: "absolute",
              display: "inline-flex",
              height: "100%",
              width: "100%",
              borderRadius: "50%",
              backgroundColor: "#ef4444",
              opacity: 0.75,
              animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
            }}
          />
          <span
            style={{
              position: "relative",
              display: "inline-flex",
              height: 8,
              width: 8,
              borderRadius: "50%",
              backgroundColor: "#ef4444",
              boxShadow: "0 0 8px rgba(239, 68, 68, 0.8)",
            }}
          />
        </span>
      </div>

      {/* Back online pill - Upgraded to match styling with subtle green accents */}
      <div
        role="status"
        aria-live="polite"
        style={{
          position: "fixed",
          bottom: "2rem",
          left: "50%",
          transform: `translateX(-50%) translateY(${showRestoredBanner ? "0" : "2rem"}) scale(${showRestoredBanner ? 1 : 0.95})`,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.75rem 1.25rem",
          borderRadius: "9999px",
          background: "rgba(24, 24, 27, 0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(52, 211, 153, 0.2)",
          color: "#e4e4e7",
          fontSize: "0.875rem",
          fontWeight: 500,
          letterSpacing: "-0.01em",
          boxShadow:
            "0 20px 40px -8px rgba(0,0,0,0.5), 0 0 20px rgba(52, 211, 153, 0.15)", // Subtle green glow
          transition: `all 0.5s ${springEasing}`,
          opacity: showRestoredBanner ? 1 : 0,
          pointerEvents: "none",
        }}
      >
        <div style={{ color: "#34d399", display: "flex" }}>
          <Wifi size={18} strokeWidth={2.5} />
        </div>
        <span>Connection restored</span>
      </div>

      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.8; }
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </>
  );
}
