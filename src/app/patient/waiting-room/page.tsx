"use client";

import WidthConstraint from "@/components/ui/width-constraint";
import { usePatientWaitingRoom } from "@/hooks/patient/usePatientWaitingRoom";
import {
  WaitingRoomHeader,
  WaitingRoomStatusCard,
  WaitingRoomInfoBox,
  WaitingRoomFooter,
} from "@/features/patient/components/waiting-room";

export default function WaitingRoomPage() {
  const { elapsedTime, formatTime, handleBackToLockIn } =
    usePatientWaitingRoom();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <WidthConstraint>
        <div className="p-8 text-center">
          <WaitingRoomHeader />

          <WaitingRoomStatusCard
            elapsedTime={elapsedTime}
            formattedTime={formatTime(elapsedTime)}
          />

          <WaitingRoomInfoBox />

          <WaitingRoomFooter onBack={handleBackToLockIn} />
        </div>
      </WidthConstraint>
    </div>
  );
}
