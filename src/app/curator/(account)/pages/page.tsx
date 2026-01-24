"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import JustGoHealth from "@/components/logo-purple";
import { Button } from "@/components/ui/button";
import { School } from "@/types/school";
import SchoolSelectionModal from "@/components/modals/school-selection-pages";
import AddCoverPageModal from "@/components/modals/add-cover-page";
import AddIconModal from "@/components/modals/add-icon";
import WidthConstraint from "@/components/ui/width-constraint";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { useSchools } from "@/hooks/queries/useSchoolsQuery";
import { Lock } from "lucide-react";

type TabType = "cover-page" | "icons" | "lock-ins";

interface CoverPage {
  id: string;
  photo: File | string;
  photoPreview: string;
  color: string;
  slogan: string;
  schoolId: number | null;
}

interface Icon {
  id: string;
  photo: File | string;
  photoPreview: string;
  name: string;
  slogan: string;
  rank: number;
  schoolId: number | null;
  lockInsCount: number;
}

interface LockInStudent {
  studentName: string;
  lockinScore: number;
  lockedInInterpretation: string;
  lockedInColor: string;
  schoolId?: number;
  schoolName?: string;
}

export default function CuratorPagesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("cover-page");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddIconModal, setShowAddIconModal] = useState(false);
  const [coverPages, setCoverPages] = useState<CoverPage[]>([]);
  const [icons, setIcons] = useState<Icon[]>([]);
  const [allLockIns, setAllLockIns] = useState<LockInStudent[]>([]);
  const [lockInsLoading, setLockInsLoading] = useState(false);
  const [lockInsBySchool, setLockInsBySchool] = useState<Map<number | null, LockInStudent[]>>(new Map());
  const { data: allSchools = [] } = useSchools();

  const [editingCoverPage, setEditingCoverPage] = useState<CoverPage | null>(null);
  const [editingIcon, setEditingIcon] = useState<Icon | null>(null);

  const handleCoverPageComplete = (data: {
    photo: File | null;
    color: string;
    slogan: string;
  }) => {
    const targetSchoolId = selectedSchool?.id || null;
    
    if (editingCoverPage) {
      // Update existing cover page
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedCoverPage: CoverPage = {
          ...editingCoverPage,
          photo: data.photo || editingCoverPage.photo,
          photoPreview: data.photo ? (reader.result as string) : editingCoverPage.photoPreview,
          color: data.color,
          slogan: data.slogan,
        };
        setCoverPages(coverPages.map((page) => 
          page.id === editingCoverPage.id ? updatedCoverPage : page
        ));
        setShowAddModal(false);
        setEditingCoverPage(null);
      };
      
      if (data.photo) {
        reader.readAsDataURL(data.photo);
      } else {
        // No new photo, just update other fields
        const updatedCoverPage: CoverPage = {
          ...editingCoverPage,
          color: data.color,
          slogan: data.slogan,
        };
        setCoverPages(coverPages.map((page) => 
          page.id === editingCoverPage.id ? updatedCoverPage : page
        ));
        setShowAddModal(false);
        setEditingCoverPage(null);
      }
    } else {
      // Create new cover page
      if (data.photo) {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Remove existing cover page for this school/platform
          const filteredPages = coverPages.filter(
            (page) => page.schoolId !== targetSchoolId
          );
          
          const newCoverPage: CoverPage = {
            id: Date.now().toString(),
            photo: data.photo!,
            photoPreview: reader.result as string,
            color: data.color,
            slogan: data.slogan,
            schoolId: targetSchoolId,
          };
          setCoverPages([...filteredPages, newCoverPage]);
          setShowAddModal(false);
        };
        reader.readAsDataURL(data.photo);
      }
    }
  };

  const handleCoverPageClick = (coverPage: CoverPage) => {
    setEditingCoverPage(coverPage);
    setShowAddModal(true);
  };

  const handleSchoolSelect = (school: School | null) => {
    setSelectedSchool(school);
    setShowSchoolModal(false);
  };

  const handleClearSchool = () => {
    setSelectedSchool(null);
  };

  const handleIconComplete = (data: {
    photo: File | null;
    name: string;
    slogan: string;
    rank: number;
  }) => {
    const targetSchoolId = selectedSchool?.id || null;
    const currentLockIns = lockInsBySchool.get(targetSchoolId) || [];
    
    if (editingIcon) {
      // Update existing icon
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedIcon: Icon = {
          ...editingIcon,
          photo: data.photo || editingIcon.photo,
          photoPreview: data.photo ? (reader.result as string) : editingIcon.photoPreview,
          name: data.name,
          slogan: data.slogan,
          rank: data.rank,
          lockInsCount: currentLockIns.length,
        };
        setIcons(icons.map((icon) => 
          icon.id === editingIcon.id ? updatedIcon : icon
        ));
        setShowAddIconModal(false);
        setEditingIcon(null);
      };
      
      if (data.photo) {
        reader.readAsDataURL(data.photo);
      } else {
        // No new photo, just update other fields
        const updatedIcon: Icon = {
          ...editingIcon,
          name: data.name,
          slogan: data.slogan,
          rank: data.rank,
          lockInsCount: currentLockIns.length,
        };
        setIcons(icons.map((icon) => 
          icon.id === editingIcon.id ? updatedIcon : icon
        ));
        setShowAddIconModal(false);
        setEditingIcon(null);
      }
    } else {
      // Create new icon
      if (data.photo) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newIcon: Icon = {
            id: Date.now().toString(),
            photo: data.photo!,
            photoPreview: reader.result as string,
            name: data.name,
            slogan: data.slogan,
            rank: data.rank,
            schoolId: targetSchoolId,
            lockInsCount: currentLockIns.length,
          };
          setIcons([...icons, newIcon]);
          setShowAddIconModal(false);
        };
        reader.readAsDataURL(data.photo);
      }
    }
  };

  const handleIconClick = (icon: Icon) => {
    setEditingIcon(icon);
    setShowAddIconModal(true);
  };

  const loadAllLockIns = useCallback(async (isBackground = false) => {
    if (!isBackground) {
      setLockInsLoading(true);
    }
    try {
      const lockInsPromises = allSchools.map(async (school: School) => {
        try {
          const response = await api(ENDPOINTS.getSchoolLockIn(school.id));
          if (response?.success && response.data) {
            const lockInData = response.data as {
              schoolName: string;
              students: Array<{
                studentName: string;
                lockinScore: number;
                lockedInInterpretation: string;
                lockedInColor: string;
              }>;
            };
            return {
              schoolId: school.id,
              students: (lockInData.students || []).map((student) => ({
                ...student,
                schoolId: school.id,
                schoolName: lockInData.schoolName,
              })),
            };
          }
        } catch (error) {
          // Silently handle "No lockins found"
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (!errorMessage.includes("No lockins found")) {
            // Only log if it's not the expected "no lockins" case
          }
        }
        return { schoolId: school.id, students: [] };
      });

      const results = await Promise.all(lockInsPromises);
      const allStudents = results.flatMap((r) => r.students);
      setAllLockIns(allStudents);

      // Store lock-ins by school for icons
      const lockInsMap = new Map<number | null, LockInStudent[]>();
      results.forEach((result) => {
        lockInsMap.set(result.schoolId, result.students);
      });
      // Also store platform lock-ins (all schools combined)
      lockInsMap.set(null, allStudents);
      setLockInsBySchool(lockInsMap);
    } catch (error) {
      // Error loading lock-ins
    } finally {
      if (!isBackground) {
        setLockInsLoading(false);
      }
    }
  }, [allSchools]);

  // Load lock-ins when tab is active or in background
  useEffect(() => {
    if (allSchools.length > 0) {
      if (activeTab === "lock-ins" || activeTab === "icons") {
        loadAllLockIns(activeTab !== "lock-ins"); // Background load for icons tab
      }
    }
  }, [activeTab, loadAllLockIns, allSchools.length]);

  // Background refresh every 30 seconds for active tabs
  useEffect(() => {
    if (allSchools.length === 0) return;
    if (activeTab === "lock-ins" || activeTab === "icons") {
      const interval = setInterval(() => {
        loadAllLockIns(true);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab, allSchools.length, loadAllLockIns]);

  const tabs = [
    { id: "cover-page" as TabType, label: "Cover Page" },
    { id: "icons" as TabType, label: "Icons" },
    { id: "lock-ins" as TabType, label: "Lock-ins" },
  ];

  // Get cover page for current context (selected school or platform)
  const displayCoverPage = selectedSchool
    ? coverPages.find((page) => page.schoolId === selectedSchool.id)
    : coverPages.find((page) => page.schoolId === null);

  return (
    <WidthConstraint>
      <div className="p-8">
        {/* Header with Logo and School Info */}
        <div className="mb-8">
          {selectedSchool ? (
            <div className="flex items-center justify-center gap-4 mb-6">
              {selectedSchool.logo ? (
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                  <Image
                    src={selectedSchool.logo}
                    alt={selectedSchool.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                  <span className="text-2xl">🏫</span>
                </div>
              )}
              <h1 className="text-3xl font-bold text-[#22c55e]">
                {selectedSchool.name}
              </h1>
            </div>
          ) : (
            <div className="mb-6 flex justify-center">
              <JustGoHealth />
            </div>
          )}

          {/* Tabs - Centered */}
          <div className="flex items-center justify-center gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-[#955aa4] text-white shadow-md shadow-[#955aa4]/20"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {activeTab === "cover-page" && (
          <>
            {!displayCoverPage ? (
              <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
                <p className="text-4xl font-bold text-gray-400 mb-4">
                  Nothing to see yet.
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  You can{" "}
                  <button
                    onClick={() => {
                      setEditingCoverPage(null);
                      setShowAddModal(true);
                    }}
                    className="px-3 py-1.5 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                  >
                    + ADD
                  </button>{" "}
                  a new cover page.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Cover Page Display - Clickable to Edit */}
                <button
                  onClick={() => handleCoverPageClick(displayCoverPage)}
                  className="relative w-full rounded-xl overflow-hidden border-2 border-[#955aa4] hover:border-[#955aa4]/70 transition-all cursor-pointer"
                >
                  <div
                    className="w-full h-96 relative"
                    style={{ backgroundColor: `#${displayCoverPage.color}` }}
                  >
                    {displayCoverPage.photoPreview && (
                      <Image
                        src={displayCoverPage.photoPreview}
                        alt="Cover page"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  {displayCoverPage.slogan && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-2xl font-bold">
                        {displayCoverPage.slogan}
                      </p>
                    </div>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === "lock-ins" && (
          <div className="space-y-4">
            {lockInsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading lock-ins...</p>
                </div>
              </div>
            ) : allLockIns.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl font-semibold text-gray-900 mb-2">
                  No lock-ins found
                </p>
                <p className="text-gray-500">
                  There are no lock-ins across all schools yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {allLockIns.map((lockIn, index) => (
                  <div
                    key={`${lockIn.schoolId}-${lockIn.studentName}-${index}`}
                    className="p-4 bg-white border border-gray-200 rounded-xl hover:border-[#955aa4]/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {lockIn.studentName}
                        </p>
                        {lockIn.schoolName && (
                          <p className="text-sm text-gray-600 mt-1">
                            {lockIn.schoolName}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {lockIn.lockinScore.toFixed(2)}
                          </p>
                          <p
                            className={`text-xs font-medium ${
                              lockIn.lockedInColor === "red"
                                ? "text-red-600"
                                : lockIn.lockedInColor === "green"
                                  ? "text-green-600"
                                  : lockIn.lockedInColor === "yellow"
                                    ? "text-yellow-600"
                                    : lockIn.lockedInColor === "purple"
                                      ? "text-purple-600"
                                      : "text-gray-600"
                            }`}
                          >
                            {lockIn.lockedInInterpretation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "icons" && (
          <>
            {(() => {
              const currentIcons = selectedSchool
                ? icons.filter((icon) => icon.schoolId === selectedSchool.id)
                : icons.filter((icon) => icon.schoolId === null);
              
              return currentIcons.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
                  <p className="text-4xl font-bold text-gray-400 mb-4">
                    Nothing to see yet.
                  </p>
                  <p className="text-lg text-gray-600 mb-4">
                    You can{" "}
                    <button
                      onClick={() => {
                        setEditingIcon(null);
                        setShowAddIconModal(true);
                      }}
                      className="px-3 py-1.5 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                    >
                      + ADD
                    </button>{" "}
                    new Icons.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentIcons
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
                              fill
                              className="object-cover"
                            />
                            {/* Rank Badge */}
                            <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white border-2 border-black flex items-center justify-center z-10">
                              <span className="text-black font-bold text-lg">#{icon.rank}</span>
                            </div>
                            {/* Name and Lock-ins Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                              <p className="text-white text-3xl font-bold">{icon.name}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-white/90 text-sm">
                                  {icon.lockInsCount} Lock-ins
                                </span>
                                <Lock className="w-4 h-4 text-yellow-500" />
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
              );
            })()}
          </>
        )}

        {/* Selector Bar - Always visible, positioned at bottom center */}
        {(activeTab === "cover-page" || activeTab === "icons") && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
            <Button
              onClick={() => setShowSchoolModal(true)}
              className="bg-[#f6f9e6] hover:bg-[#f6f9e6]/90 text-gray-800 font-semibold px-6 py-3 rounded-full shadow-lg"
            >
              {selectedSchool ? `${selectedSchool.name} >` : "Select school >"}
            </Button>
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
          onClose={() => {
            setShowAddModal(false);
            setEditingCoverPage(null);
          }}
          onComplete={handleCoverPageComplete}
          editData={editingCoverPage ? {
            photoPreview: editingCoverPage.photoPreview,
            color: editingCoverPage.color,
            slogan: editingCoverPage.slogan,
          } : null}
        />

        {/* Add Icon Modal */}
        <AddIconModal
          isOpen={showAddIconModal}
          onClose={() => {
            setShowAddIconModal(false);
            setEditingIcon(null);
          }}
          onComplete={handleIconComplete}
          editData={editingIcon ? {
            photoPreview: editingIcon.photoPreview,
            name: editingIcon.name,
            slogan: editingIcon.slogan,
            rank: editingIcon.rank,
          } : null}
          selectedSchool={selectedSchool}
          lockIns={(lockInsBySchool.get(selectedSchool?.id || null) || []).map((lockIn) => ({
            studentName: lockIn.studentName,
            lockinScore: lockIn.lockinScore,
            lockedInInterpretation: lockIn.lockedInInterpretation,
            lockedInColor: lockIn.lockedInColor,
          }))}
        />
      </div>
    </WidthConstraint>
  );
}
