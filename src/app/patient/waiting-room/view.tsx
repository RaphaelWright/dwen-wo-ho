"use client";

import WidthConstraint from "@/components/ui/width-constraint";
import { usePatientWaitingRoom } from "@/hooks/patient/use-patient-waiting-room";
import {
  WaitingRoomHeader,
  WaitingRoomStatusCard,
  WaitingRoomInfoBox,
  WaitingRoomFooter,
} from "@/components/patient/waiting-room";

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
