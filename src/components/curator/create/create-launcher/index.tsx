"use client";
import { X } from "lucide-react";
import FeatureComingSoonOverlay from "@/components/shared/overlays/feature-coming-soon";
import { CreateLauncherProps } from "@/lib/types/components/curator/create/create";
import { useCreateLauncher } from "@/hooks/components/curator/create/use-create-launcher";
import { activateOnKeyboard } from "@/lib/utils/shared/a11y";
import { Button } from "@/components/ui/button";

const CreateLauncher = ({
  setShowCreateLauncher,
  onOpenSchoolModal,
  onOpenMemberModal,
  onOpenPartnerModal,
  onOpenReachOverview,
}: CreateLauncherProps) => {
  const {
    comingSoonFeature,
    setComingSoonFeature,
    menuItems,
    handleItemClick,
  } = useCreateLauncher({
    onOpenSchoolModal,
    onOpenMemberModal,
    onOpenPartnerModal,
    onOpenReachOverview,
  });

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="Close dialog"
        className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl"
        onClick={() => setShowCreateLauncher(false)}
        onKeyDown={activateOnKeyboard(() => setShowCreateLauncher(false))}
      >
        <div
          className="bg-card text-foreground border-border w-full max-w-3xl transform overflow-hidden rounded-2xl border shadow-2xl transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-border bg-muted/30 flex items-center justify-between border-b px-8 py-6">
            <div>
              <h2 className="text-foreground text-2xl font-bold">
                Creative Studios
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Select a module to create or manage content
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={() => setShowCreateLauncher(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Grid */}
          <div className="p-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    variant="ghost"
                    className="group hover:bg-muted hover:border-border flex h-auto flex-col items-center rounded-xl border border-transparent p-4 transition-all duration-200"
                  >
                    <div
                      className={`h-16 w-16 rounded-2xl ${item.bgColor} mb-4 flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-110`}
                    >
                      <Icon className={`h-8 w-8 ${item.color}`} />
                    </div>
                    <h3 className="text-foreground text-sm font-semibold">
                      {item.label}
                    </h3>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-muted/30 border-border border-t px-8 py-4 text-center">
            <p className="text-muted-foreground text-xs font-medium">
              JUSTGO HEALTH CURATOR PORTAL
            </p>
          </div>
        </div>
      </div>

      <FeatureComingSoonOverlay
        isOpen={!!comingSoonFeature}
        onClose={() => setComingSoonFeature(null)}
        featureName={comingSoonFeature || ""}
      />
    </>
  );
};

export default CreateLauncher;
