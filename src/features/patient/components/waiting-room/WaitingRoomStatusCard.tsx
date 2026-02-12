"use client";

import { Loader2, Clock, Users } from "lucide-react";

interface WaitingRoomStatusCardProps {
  elapsedTime: number;
  formattedTime: string;
}

export function WaitingRoomStatusCard({
  elapsedTime,
  formattedTime,
}: WaitingRoomStatusCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 max-w-2xl mx-auto mb-8">
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
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Waiting for Provider
      </h1>

      {/* Description */}
      <p className="text-gray-600 mb-8 text-lg text-center">
        Your lock-in form has been submitted successfully. A healthcare provider
        will review your information and initiate a session with you shortly.
      </p>

      {/* Timer */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <Clock className="w-5 h-5 text-gray-500" />
        <span className="text-lg font-semibold text-gray-700">
          Waiting time: {formattedTime}
        </span>
      </div>

      {/* Status Message */}
      <div className="bg-[#955aa4]/10 border border-[#955aa4]/20 rounded-lg p-4">
        <p className="text-[#955aa4] font-medium text-center">
          Please stay on this page. You will be notified when a provider is
          ready to assist you.
        </p>
      </div>
    </div>
  );
}
