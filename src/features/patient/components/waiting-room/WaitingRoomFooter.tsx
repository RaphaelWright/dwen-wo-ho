"use client";

interface WaitingRoomFooterProps {
  onBack: () => void;
}

export function WaitingRoomFooter({ onBack }: WaitingRoomFooterProps) {
  return (
    <div className="mt-12 text-center">
      <button
        onClick={onBack}
        className="text-[#955aa4] hover:text-[#955aa4]/80 font-medium text-sm underline transition-colors"
      >
        Go back to lock-in page
      </button>
    </div>
  );
}
