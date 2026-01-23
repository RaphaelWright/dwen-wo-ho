"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WidthConstraint from "@/components/ui/width-constraint";
import JustGoHealth from "@/components/logo-purple";
import { Loader2, Clock, Users } from "lucide-react";

export default function WaitingRoomPage() {
  const router = useRouter();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Start timer when component mounts
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <WidthConstraint>
        <div className="p-8 text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <JustGoHealth />
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 max-w-2xl mx-auto">
            {/* Loading Animation */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-[#955aa4] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="w-8 h-8 text-[#955aa4]/50" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Waiting for Provider
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-8 text-lg">
              Your lock-in form has been submitted successfully. A healthcare provider will review your information and initiate a session with you shortly.
            </p>

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="text-lg font-semibold text-gray-700">
                Waiting time: {formatTime(elapsedTime)}
              </span>
            </div>

            {/* Status Message */}
            <div className="bg-[#955aa4]/10 border border-[#955aa4]/20 rounded-lg p-4 mb-6">
              <p className="text-[#955aa4] font-medium">
                Please stay on this page. You will be notified when a provider is ready to assist you.
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#955aa4] mt-1">•</span>
                  <span>A provider will review your submitted information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#955aa4] mt-1">•</span>
                  <span>They will initiate a session with you when ready</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#955aa4] mt-1">•</span>
                  <span>You'll receive a notification when the session begins</span>
                </li>
              </ul>
            </div>

            {/* Back Button */}
            <div className="mt-8">
              <button
                onClick={() => router.push("/patient/lock-in")}
                className="text-[#955aa4] hover:text-[#955aa4]/80 font-medium text-sm underline"
              >
                Go back to lock-in page
              </button>
            </div>
          </div>
        </div>
      </WidthConstraint>
    </div>
  );
}
