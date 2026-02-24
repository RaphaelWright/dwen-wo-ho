import Image from "next/image";
import { Handshake } from "lucide-react";
import { FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { PartnerHeaderProps } from "@/lib/types/components/modals/partner-details";

export const PartnerHeader = ({ partner, onClose }: PartnerHeaderProps) => {
  return (
    <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
      <div className="flex items-center gap-4">
        {partner?.logo ? (
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={partner.logo}
              alt={partner.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-linear-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Handshake className="w-8 h-8 text-white" />
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
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
      >
        <FiX className="w-5 h-5" />
      </Button>
    </div>
  );
};
