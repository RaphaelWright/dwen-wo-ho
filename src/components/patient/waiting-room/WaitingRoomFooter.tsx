import { WaitingRoomFooterProps } from "@/lib/types/components/patient/waiting-room";
import { WAITING_ROOM_TEXTS } from "@/lib/constants/components/patient/waiting-room";
import { Button } from "@/components/ui/button";

export function WaitingRoomFooter({ onBack }: WaitingRoomFooterProps) {
  return (
    <div className="mt-12 text-center">
      <Button
        onClick={onBack}
        className="text-primary hover:text-primary/80 text-sm font-medium underline transition-colors"
      >
        {WAITING_ROOM_TEXTS.footer.backText}
      </Button>
    </div>
  );
}
