import { FiMail, FiPhone, FiCalendar, FiAward, FiUsers } from "react-icons/fi";
import { timeAgo } from "@/lib/utils/timeAgo";
import { OverviewTabProps } from "@/lib/types/components/modals/provider-details";

export const OverviewTab = ({ provider }: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      {/* Status Message */}
      {provider?.status && (
        <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span className="text-lg">💬</span>
            Status Message
          </h4>
          <p className="text-gray-500 italic">&quot;{provider.status}&quot;</p>
        </div>
      )}

      {/* Contact Info Section */}
      <div>
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <FiUsers className="w-5 h-5 text-teal-600" />
          Contact Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border/50 hover:border-border transition-colors">
            <div className="size-10 bg-muted/50 rounded-full flex items-center justify-center shadow-sm text-muted-foreground ring-1 ring-border">
              <FiMail className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Email Address
              </p>
              <p className="text-sm font-medium text-foreground">
                {provider?.email}
              </p>
            </div>
          </div>
          {provider?.officePhoneNumber && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border/50 hover:border-border transition-colors">
              <div className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center shadow-sm text-muted-foreground ring-1 ring-border">
                <FiPhone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Phone Number
                </p>
                <p className="text-sm font-medium text-foreground">
                  {provider.officePhoneNumber}
                </p>
              </div>
            </div>
          )}
          {provider?.applicationDate && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border/50 hover:border-border transition-colors">
              <div className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center shadow-sm text-muted-foreground ring-1 ring-border">
                <FiCalendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Application Date
                </p>
                <p className="text-sm font-medium text-foreground">
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
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <FiAward className="w-5 h-5 text-teal-600" />
              Specialties
            </h4>
            <div className="flex flex-wrap gap-2">
              {provider.specialties
                .filter((s: string) => s && s.trim())
                .map((specialty: string, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:border-primary/50 transition-colors shadow-sm"
                  >
                    {specialty}
                  </span>
                ))}
            </div>
          </div>
        )}

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
            Member Since
          </p>
          <p className="font-semibold text-foreground">
            {provider?.createdAt
              ? new Date(provider.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"}
          </p>
        </div>
        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
            Last Updated
          </p>
          <p className="font-semibold text-foreground">
            {provider?.updatedAt ? timeAgo(provider.updatedAt) : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};
