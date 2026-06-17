import { WAITING_ROOM_TEXTS } from "@/lib/constants/components/patient/auth-copy";

export function WaitingRoomInfoBox() {
  return (
    <div className="bg-muted mx-auto max-w-2xl rounded-lg p-6 text-left">
      <h3 className="text-foreground mb-4 text-lg font-semibold">
        {WAITING_ROOM_TEXTS.infoBox.title}
      </h3>
      <ul className="text-muted-foreground space-y-4">
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
