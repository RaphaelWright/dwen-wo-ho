import { Loader2, Clock, Users } from "lucide-react";
import { WaitingRoomStatusCardProps } from "@/lib/types/components/patient/waiting-room";
import { WAITING_ROOM_TEXTS } from "@/lib/constants/components/patient/waiting-room";

export function WaitingRoomStatusCard({
  formattedTime,
}: WaitingRoomStatusCardProps) {
  return (
    <div className="bg-card rounded-xl shadow-lg border border-border p-12 max-w-2xl mx-auto mb-8">
      {/* Loading Animation */}
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="w-8 h-8 text-primary/50" />
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-foreground mb-4 text-center">
        {WAITING_ROOM_TEXTS.statusCard.title}
      </h1>

      {/* Description */}
      <p className="text-muted-foreground mb-8 text-lg text-center">
        {WAITING_ROOM_TEXTS.statusCard.description}
      </p>

      {/* Timer */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <Clock className="w-5 h-5 text-muted-foreground" />
        <span className="text-lg font-semibold text-foreground">
          {WAITING_ROOM_TEXTS.statusCard.waitingTime} {formattedTime}
        </span>
      </div>

      {/* Status Message */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <p className="text-primary font-medium text-center">
          {WAITING_ROOM_TEXTS.statusCard.statusMessage}
        </p>
      </div>
    </div>
  );
}
