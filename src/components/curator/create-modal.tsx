"use client";
import { X } from "lucide-react";
import FeatureComingSoonModal from "@/components/modals/feature-coming-soon";
import { CreateModalProps } from "@/lib/types/components/curator/create-modal";
import { useCreateModal } from "@/hooks/components/curator/use-create-modal";
import { activateOnKeyboard } from "@/lib/utils/a11y";
import { Button } from "../ui/button";

const CreateModal = ({
  setShowCreateModal,
  onOpenSchoolModal,
  onOpenMemberModal,
  onOpenPartnerModal,
  onOpenReachModal,
}: CreateModalProps) => {
  const {
    comingSoonFeature,
    setComingSoonFeature,
    menuItems,
    handleItemClick,
  } = useCreateModal({
    onOpenSchoolModal,
    onOpenMemberModal,
    onOpenPartnerModal,
    onOpenReachModal,
  });

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="Close dialog"
        className="fixed inset-0 backdrop-blur-3xl bg-background/80 flex items-center justify-center z-50 p-4"
        onClick={() => setShowCreateModal(false)}
        onKeyDown={activateOnKeyboard(() => setShowCreateModal(false))}
      >
        <div
          className="bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-muted/30">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Creative Studios
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Select a module to create or manage content
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-full"
              onClick={() => setShowCreateModal(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Grid */}
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    variant="ghost"
                    className="flex flex-col items-center group p-4 rounded-xl hover:bg-muted transition-all duration-200 border border-transparent hover:border-border h-auto"
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl ${item.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-sm`}
                    >
                      <Icon className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">
                      {item.label}
                    </h3>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-muted/30 border-t border-border text-center">
            <p className="text-xs text-muted-foreground font-medium">
              JUSTGO HEALTH CURATOR PORTAL
            </p>
          </div>
        </div>
      </div>

      <FeatureComingSoonModal
        isOpen={!!comingSoonFeature}
        onClose={() => setComingSoonFeature(null)}
        featureName={comingSoonFeature || ""}
      />
    </>
  );
};

export default CreateModal;
