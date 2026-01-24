"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import JustGoHealth from "@/components/logo-purple";
import { Button } from "@/components/ui/button";
import { School } from "@/types/school";
import SchoolSelectionModal from "@/components/modals/school-selection-pages";
import AddCoverPageModal from "@/components/modals/add-cover-page";
import WidthConstraint from "@/components/ui/width-constraint";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { useSchools } from "@/hooks/queries/useSchoolsQuery";

type TabType = "cover-page" | "icons" | "lock-ins";

interface CoverPage {
  id: string;
  photo: File | string;
  photoPreview: string;
  color: string;
  slogan: string;
  schoolId: number | null;
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
  const [coverPages, setCoverPages] = useState<CoverPage[]>([]);
  const [allLockIns, setAllLockIns] = useState<LockInStudent[]>([]);
  const [lockInsLoading, setLockInsLoading] = useState(false);
  const { data: allSchools = [] } = useSchools();

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school);
    setShowSchoolModal(false);
  };

  const handleCoverPageComplete = (data: {
    photo: File | null;
    color: string;
    slogan: string;
  }) => {
    if (data.photo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newCoverPage: CoverPage = {
          id: Date.now().toString(),
          photo: data.photo!,
          photoPreview: reader.result as string,
          color: data.color,
          slogan: data.slogan,
          schoolId: selectedSchool?.id || null,
        };
        setCoverPages([...coverPages, newCoverPage]);
        setShowAddModal(false);
      };
      reader.readAsDataURL(data.photo);
    }
  };

  const loadAllLockIns = useCallback(async () => {
    setLockInsLoading(true);
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
            return (lockInData.students || []).map((student) => ({
              ...student,
              schoolId: school.id,
              schoolName: lockInData.schoolName,
            }));
          }
        } catch (error) {
          // Silently handle "No lockins found"
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (!errorMessage.includes("No lockins found")) {
            // Only log if it's not the expected "no lockins" case
          }
        }
        return [];
      });

      const results = await Promise.all(lockInsPromises);
      const allStudents = results.flat();
      setAllLockIns(allStudents);
    } catch (error) {
      // Error loading lock-ins
    } finally {
      setLockInsLoading(false);
    }
  }, [allSchools]);

  useEffect(() => {
    if (activeTab === "lock-ins" && allSchools.length > 0) {
      loadAllLockIns();
    }
  }, [activeTab, loadAllLockIns, allSchools.length]);

  const tabs = [
    { id: "cover-page" as TabType, label: "Cover Page" },
    { id: "icons" as TabType, label: "Icons" },
    { id: "lock-ins" as TabType, label: "Lock-ins" },
  ];

  const currentCoverPage = coverPages.find(
    (page) => page.schoolId === (selectedSchool?.id || null)
  );
  const platformCoverPage = coverPages.find((page) => page.schoolId === null);
  const displayCoverPage = currentCoverPage || platformCoverPage;

  return (
    <WidthConstraint>
      <div className="p-8">
        {/* Header with Logo and School Info */}
        <div className="mb-8">
          {selectedSchool ? (
            <div className="flex items-center gap-4 mb-6">
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
            <div className="mb-6">
              <JustGoHealth />
            </div>
          )}

          {/* Tabs with School Selector */}
          <div className="flex items-center gap-3">
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
            {selectedSchool && (
              <Button
                onClick={() => setShowSchoolModal(true)}
                variant="outline"
                className="ml-auto border-[#955aa4] text-[#955aa4] hover:bg-[#955aa4]/10"
              >
                {selectedSchool.name}
              </Button>
            )}
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
                <p className="text-lg text-gray-600 mb-6">
                  You can{" "}
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-3 py-1.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    + ADD
                  </button>{" "}
                  a new cover page.
                </p>
                {!selectedSchool && (
                  <Button
                    onClick={() => setShowSchoolModal(true)}
                    className="bg-yellow-200 hover:bg-yellow-300 text-gray-800 font-semibold px-6 py-3 rounded-lg"
                  >
                    Select school &gt;
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Cover Page Display */}
                <div className="relative w-full rounded-xl overflow-hidden border-2 border-[#955aa4]">
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
                </div>
                {!displayCoverPage && (
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    + ADD Cover Page
                  </Button>
                )}
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
          <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
            <p className="text-4xl font-bold text-gray-400 mb-4">
              Coming soon...
            </p>
          </div>
        )}

        {/* Selector Bar - Shows school name when selected, positioned at bottom center */}
        {selectedSchool && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
            <Button
              onClick={() => setShowSchoolModal(true)}
              className="bg-yellow-200 hover:bg-yellow-300 text-gray-800 font-semibold px-6 py-3 rounded-lg shadow-lg"
            >
              {selectedSchool.name} &gt;
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
          onClose={() => setShowAddModal(false)}
          onComplete={handleCoverPageComplete}
        />
      </div>
    </WidthConstraint>
  );
}
