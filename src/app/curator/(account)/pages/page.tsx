"use client";

import Image from "next/image";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import SchoolSelectionModal from "@/components/modals/school-selection-pages";
import AddCoverPageModal from "@/components/modals/add-cover-page";
import AddIconModal from "@/components/modals/add-icon";
import WidthConstraint from "@/components/ui/width-constraint";
import { Lock } from "lucide-react";
import { useCuratorContentPages } from "@/hooks/curator/curator-content-pages";

export default function CuratorPagesPage() {
  const {
    activeTab,
    setActiveTab,
    selectedSchool,
    showSchoolModal,
    setShowSchoolModal,
    showAddModal,
    showAddIconModal,
    coverPages: displayCoverPages,
    icons: displayIcons,
    editingCoverPage,
    editingIcon,
    tabs,
    handleCoverPageComplete,
    handleCoverPageClick,
    handleSchoolSelect,
    handleIconComplete,
    handleIconClick,
    openAddCoverPage,
    closeAddCoverPage,
    openAddIcon,
    closeAddIcon,
  } = useCuratorContentPages();

  return (
    <WidthConstraint>
      <div className="p-8 overflow-x-hidden">
        {/* Header with Logo and School Info - scaled 1.2 */}
        <div className="mb-8 flex items-center justify-center min-h-30">
          {selectedSchool ? (
            <div className="flex items-center justify-center gap-4 mb-6 scale-[1.2] origin-center">
              {selectedSchool.logo ? (
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                  <Image
                    src={selectedSchool.logo}
                    alt={selectedSchool.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-2xl">🏫</span>
                </div>
              )}
              <h1 className="text-3xl font-bold text-[#22c55e]">
                {selectedSchool.name}
              </h1>
            </div>
          ) : (
            <div className="mb-6 flex justify-center scale-[1.2] origin-center">
              <Logo />
            </div>
          )}
        </div>

        {/* Tabs - Centered (matches reference) */}
        <div className="flex items-center justify-center gap-4 mt-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-3 rounded-full text-base font-semibold transition-all
                  ${
                    isActive
                      ? "bg-[#955aa4] text-white"
                      : "bg-[#a3a3a3] text-white/90 hover:bg-[#8f8f8f]"
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        {activeTab === "cover-page" && (
          <>
            {displayCoverPages.length === 0 ? (
              <>
                <div className="flex flex-col items-center justify-center py-10">
                  <h2 className="text-[70px] font-extrabold text-gray-400 text-center leading-tight">
                    Nothing to see yet.
                  </h2>

                  <p className="mt-6 text-lg text-gray-1000 flex items-center gap-2">
                    You can
                    <button
                      onClick={openAddCoverPage}
                      className="px-5 py-2 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition"
                    >
                      + A D D
                    </button>
                    a new cover page.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center mb-6">
                  <p className="text-lg text-gray-600 mb-2">
                    You can{" "}
                    <button
                      onClick={openAddCoverPage}
                      className="py-1.5 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors px-4"
                    >
                      + ADD
                    </button>{" "}
                    a new cover page.
                  </p>
                </div>
                <div className="space-y-6">
                  {displayCoverPages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => handleCoverPageClick(page)}
                      className="relative w-full rounded-xl overflow-hidden border-2 border-[#955aa4] hover:border-[#955aa4]/70 transition-all cursor-pointer"
                    >
                      <div
                        className="w-full h-96 relative"
                        style={{ backgroundColor: `#${page.color}` }}
                      >
                        {page.photoPreview && (
                          <Image
                            src={page.photoPreview}
                            alt="Cover page"
                            width={600}
                            height={400}
                            className="object-cover w-full h-full"
                          />
                        )}
                      </div>
                      {page.slogan && (
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/70 to-transparent">
                          <p className="text-white text-2xl font-bold">
                            {page.slogan}
                          </p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === "lock-ins" && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-900 mb-2">
                No lock-ins available
              </p>
              <p className="text-gray-500">
                Lock-ins are not available at the moment.
              </p>
            </div>
          </div>
        )}

        {activeTab === "icons" && (
          <>
            {displayIcons.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-2 min-h-50">
                <p className="text-[70px] font-bold text-gray-400">
                  Nothing to see yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayIcons
                  .sort((a, b) => a.rank - b.rank)
                  .map((icon) => (
                    <button
                      key={icon.id}
                      onClick={() => handleIconClick(icon)}
                      className="relative group rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-96"
                    >
                      {icon.photoPreview ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={icon.photoPreview}
                            alt={icon.name}
                            width={600}
                            height={400}
                            className="object-contain rounded-lg w-full h-full"
                          />
                          {/* Rank Badge */}
                          <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white border-2 border-black flex items-center justify-center z-10">
                            <span className="text-black font-bold text-lg">
                              #{icon.rank}
                            </span>
                          </div>
                          {/* Name and Lock-ins Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/70 to-transparent flex flex-col items-center justify-end text-center">
                            <p className="text-white text-3xl font-bold">
                              {icon.name}
                            </p>
                            <div className="flex flex-col items-center gap-1 mt-2">
                              {(icon.lockIns || []).length > 0 ? (
                                (icon.lockIns || []).map((item, i) => (
                                  <span
                                    key={i}
                                    className="text-white/90 text-sm flex items-center gap-1.5"
                                  >
                                    <Lock className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                                    {item}
                                  </span>
                                ))
                              ) : (
                                <span className="text-white/70 text-sm">
                                  No lock-ins
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <p className="text-gray-400">{icon.name}</p>
                        </div>
                      )}
                    </button>
                  ))}
              </div>
            )}

            <div className="flex flex-col items-center justify-center mb-2">
              <p className="text-lg text-gray-1000 mb-2">
                You can{" "}
                <button
                  onClick={openAddIcon}
                  className="px-3 py-1.5 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                >
                  + A D D
                </button>{" "}
                new Icons.
              </p>
            </div>
          </>
        )}

        {/* Select school - centered like logo and tabs, scaled 1.4 */}
        {(activeTab === "cover-page" || activeTab === "icons") && (
          <div className="flex justify-center mt-4 relative top-2">
            <div className="scale-[1.4] origin-center">
              <Button
                onClick={() => setShowSchoolModal(true)}
                className="bg-[#f6f9e6] hover:bg-[#f6f9e6]/90 text-gray-800 font-semibold px-8 py-3 rounded-full shadow-lg text-lg"
              >
                {selectedSchool
                  ? `${selectedSchool.name} >`
                  : "Select school >"}
              </Button>
            </div>
          </div>
        )}

        {/* School Selection Modal */}
        <SchoolSelectionModal
          isOpen={showSchoolModal}
          onClose={() => setShowSchoolModal(false)}
          onSelect={handleSchoolSelect}
        />

        {/* Add Cover Page Modal */}
        <AddCoverPageModal
          isOpen={showAddModal}
          onClose={closeAddCoverPage}
          onComplete={handleCoverPageComplete}
          editData={
            editingCoverPage
              ? {
                  photoPreview: editingCoverPage.photoPreview,
                  color: editingCoverPage.color,
                  slogan: editingCoverPage.slogan,
                }
              : null
          }
        />

        {/* Add Icon Modal */}
        <AddIconModal
          isOpen={showAddIconModal}
          onClose={closeAddIcon}
          onComplete={handleIconComplete}
          editData={
            editingIcon
              ? {
                  photoPreview: editingIcon.photoPreview,
                  name: editingIcon.name,
                  slogan: editingIcon.slogan,
                  rank: editingIcon.rank,
                  lockIns: editingIcon.lockIns || [],
                }
              : null
          }
          selectedSchool={selectedSchool}
        />
      </div>
    </WidthConstraint>
  );
}
