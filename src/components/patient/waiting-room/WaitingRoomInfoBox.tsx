import { WAITING_ROOM_TEXTS } from "@/lib/constants/components/patient/waiting-room";

export function WaitingRoomInfoBox() {
  return (
    <div className="bg-muted rounded-lg p-6 text-left max-w-2xl mx-auto">
      <h3 className="font-semibold text-foreground mb-4 text-lg">
        {WAITING_ROOM_TEXTS.infoBox.title}
      </h3>
      <ul className="space-y-4 text-muted-foreground">
        {WAITING_ROOM_TEXTS.infoBox.items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="text-primary text-xl leading-none">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
