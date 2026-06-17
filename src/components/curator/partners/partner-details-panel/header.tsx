import Image from "next/image";
import { Handshake } from "lucide-react";
import { FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { PartnerHeaderProps } from "@/lib/types/components/curator/partners/partner-details-panel";

export const PartnerHeader = ({ partner, onClose }: PartnerHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/50 px-8 py-6">
      <div className="flex items-center gap-4">
        {partner?.logo ? (
          <div className="h-16 w-16 overflow-hidden rounded-lg border border-gray-200">
            <Image
              src={partner.logo}
              alt={partner.name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-linear-to-br from-teal-500 to-cyan-500">
            <Handshake className="h-8 w-8 text-white" />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {partner?.name || "Partner Details"}
          </h2>
          {partner?.nickname && (
            <p className="text-sm text-gray-500">@{partner.nickname}</p>
          )}
        </div>
      </div>
      <Button
        onClick={onClose}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition-all hover:bg-gray-50 hover:text-gray-600"
      >
        <FiX className="h-5 w-5" />
      </Button>
    </div>
  );
};
