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
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
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
