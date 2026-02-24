"use client";
import { FiX } from "react-icons/fi";
import FeatureComingSoonModal from "@/components/modals/feature-coming-soon";
import { CreateModalProps } from "@/lib/types/components/curator/create-modal";
import { useCreateModal } from "@/hooks/components/curator/use-create-modal";
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
        className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4"
        onClick={() => setShowCreateModal(false)}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Creative Studios
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Select a module to create or manage content
              </p>
            </div>
            <Button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm"
              onClick={() => setShowCreateModal(false)}
            >
              <FiX className="w-5 h-5" />
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
                    className="bg-transparent flex flex-col items-center group p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-100"
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl ${item.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-sm`}
                    >
                      <Icon className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-gray-900 transition-colors">
                      {item.label}
                    </h3>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-medium">
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
