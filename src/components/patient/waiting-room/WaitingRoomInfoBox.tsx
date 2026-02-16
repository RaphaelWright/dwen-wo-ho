import { WAITING_ROOM_TEXTS } from "@/lib/constants/components/patient/waiting-room";

export function WaitingRoomInfoBox() {
  return (
    <div className="bg-gray-50 rounded-lg p-6 text-left max-w-2xl mx-auto">
      <h3 className="font-semibold text-gray-900 mb-4 text-lg">
        {WAITING_ROOM_TEXTS.infoBox.title}
      </h3>
      <ul className="space-y-4 text-gray-600">
        {WAITING_ROOM_TEXTS.infoBox.items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="text-[#955aa4] text-xl leading-none">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
