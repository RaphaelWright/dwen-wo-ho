import Image from "next/image";
import { Handshake } from "lucide-react";
import { TabContentState } from "@/components/shared/tab-content-state";
import { PartnersTabProps } from "@/lib/types/components/curator/school-detail-tabs";

export const PartnersTab = ({ partners, isLoading }: PartnersTabProps) => (
  <TabContentState
    isLoading={isLoading}
    isEmpty={partners.length === 0}
    loadingMessage="Loading partners..."
    emptyMessage="No partners found for this school"
    EmptyIcon={Handshake}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {partners.map((partner) => (
        <div
          key={partner.id}
          className="bg-card rounded-xl p-4 border border-border/60 hover:border-primary/30 transition-colors shadow-sm"
        >
          <div className="flex items-start gap-3">
            {partner.logo ? (
              <Image
                src={partner.logo}
                alt={partner.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Handshake className="w-6 h-6 text-muted-foreground/50" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground truncate">
                {partner.name}
              </h4>
              {partner.nickname && (
                <p className="text-sm text-muted-foreground truncate">
                  &quot;{partner.nickname}&quot;
                </p>
              )}
              {partner.slogan && (
                <p className="text-xs text-muted-foreground/80 mt-1 truncate">
                  {partner.slogan}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </TabContentState>
);
