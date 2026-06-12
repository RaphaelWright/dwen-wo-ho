import { Loader2, Clock, Users } from "lucide-react";
import { WaitingRoomStatusCardProps } from "@/lib/types/components/patient/waiting-room";
import { WAITING_ROOM_TEXTS } from "@/lib/constants/components/patient/waiting-room";

export function WaitingRoomStatusCard({
  formattedTime,
}: WaitingRoomStatusCardProps) {
  return (
    <div className="bg-card border-border mx-auto mb-8 max-w-2xl rounded-xl border p-12 shadow-lg">
      {/* Loading Animation */}
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <Loader2 className="text-primary h-16 w-16 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="text-primary/50 h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-foreground mb-4 text-center text-3xl font-bold">
        {WAITING_ROOM_TEXTS.statusCard.title}
      </h1>

      {/* Description */}
      <p className="text-muted-foreground mb-8 text-center text-lg">
        {WAITING_ROOM_TEXTS.statusCard.description}
      </p>

      {/* Timer */}
      <div className="mb-8 flex items-center justify-center gap-2">
        <Clock className="text-muted-foreground h-5 w-5" />
        <span className="text-foreground text-lg font-semibold">
          {WAITING_ROOM_TEXTS.statusCard.waitingTime} {formattedTime}
        </span>
      </div>

      {/* Status Message */}
      <div className="bg-primary/10 border-primary/20 rounded-lg border p-4">
        <p className="text-primary text-center font-medium">
          {WAITING_ROOM_TEXTS.statusCard.statusMessage}
        </p>
      </div>
    </div>
  );
}
