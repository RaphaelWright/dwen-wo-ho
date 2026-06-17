import { FiMail, FiPhone, FiCalendar, FiAward, FiUsers } from "react-icons/fi";
import { timeAgo } from "@/lib/utils/shared/time-ago";
import { OverviewTabProps } from "@/lib/types/components/curator/providers/provider-details-panel";

export const OverviewTab = ({ provider }: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      {/* Status Message */}
      {provider?.status && (
        <div className="rounded-xl border border-teal-100 bg-teal-50 p-4">
          <h4 className="mb-2 flex items-center gap-2 font-semibold text-gray-800">
            <span className="text-lg">💬</span>
            Status Message
          </h4>
          <p className="text-gray-500 italic">&quot;{provider.status}&quot;</p>
        </div>
      )}

      {/* Contact Info Section */}
      <div>
        <h4 className="text-foreground mb-3 flex items-center gap-2 font-semibold">
          <FiUsers className="h-5 w-5 text-teal-600" />
          Contact Information
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-muted/50 border-border/50 hover:border-border flex items-center gap-3 rounded-lg border p-3 transition-colors">
            <div className="bg-muted/50 text-muted-foreground ring-border flex size-10 items-center justify-center rounded-full shadow-sm ring-1">
              <FiMail className="size-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Email Address
              </p>
              <p className="text-foreground text-sm font-medium">
                {provider?.email}
              </p>
            </div>
          </div>
          {provider?.officePhoneNumber && (
            <div className="bg-muted/50 border-border/50 hover:border-border flex items-center gap-3 rounded-lg border p-3 transition-colors">
              <div className="bg-muted/50 text-muted-foreground ring-border flex h-10 w-10 items-center justify-center rounded-full shadow-sm ring-1">
                <FiPhone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Phone Number
                </p>
                <p className="text-foreground text-sm font-medium">
                  {provider.officePhoneNumber}
                </p>
              </div>
            </div>
          )}
          {provider?.applicationDate && (
            <div className="bg-muted/50 border-border/50 hover:border-border flex items-center gap-3 rounded-lg border p-3 transition-colors">
              <div className="bg-muted/50 text-muted-foreground ring-border flex h-10 w-10 items-center justify-center rounded-full shadow-sm ring-1">
                <FiCalendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Application Date
                </p>
                <p className="text-foreground text-sm font-medium">
                  {timeAgo(provider.applicationDate)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Specialties */}
      {provider?.specialties &&
        provider.specialties.length > 0 &&
        provider.specialties.some((s: string) => s && s.trim()) && (
          <div>
            <h4 className="text-foreground mb-3 flex items-center gap-2 font-semibold">
              <FiAward className="h-5 w-5 text-teal-600" />
              Specialties
            </h4>
            <div className="flex flex-wrap gap-2">
              {provider.specialties.flatMap((specialty: string) =>
                specialty && specialty.trim()
                  ? [
                      <span
                        key={specialty}
                        className="bg-card border-border text-foreground hover:border-primary/50 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-colors"
                      >
                        {specialty}
                      </span>,
                    ]
                  : [],
              )}
            </div>
          </div>
        )}

      {/* Additional Info */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="bg-muted/30 border-border rounded-lg border p-4">
          <p className="text-muted-foreground mb-1 text-sm font-semibold tracking-wider uppercase">
            Member Since
          </p>
          <p className="text-foreground font-semibold">
            {provider?.createdAt
              ? new Date(provider.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"}
          </p>
        </div>
        <div className="bg-muted/30 border-border rounded-lg border p-4">
          <p className="text-muted-foreground mb-1 text-sm font-semibold tracking-wider uppercase">
            Last Updated
          </p>
          <p className="text-foreground font-semibold">
            {provider?.updatedAt ? timeAgo(provider.updatedAt) : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};
