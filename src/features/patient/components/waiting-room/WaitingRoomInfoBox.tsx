"use client";

export function WaitingRoomInfoBox() {
  return (
    <div className="bg-gray-50 rounded-lg p-6 text-left max-w-2xl mx-auto">
      <h3 className="font-semibold text-gray-900 mb-4 text-lg">
        What happens next?
      </h3>
      <ul className="space-y-4 text-gray-600">
        <li className="flex items-start gap-3">
          <span className="text-[#955aa4] text-xl leading-none">•</span>
          <span>A provider will review your submitted information</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-[#955aa4] text-xl leading-none">•</span>
          <span>They will initiate a session with you when ready</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-[#955aa4] text-xl leading-none">•</span>
          <span>You'll receive a notification when the session begins</span>
        </li>
      </ul>
    </div>
  );
}
