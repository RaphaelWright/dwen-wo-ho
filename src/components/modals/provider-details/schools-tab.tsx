import { FiAward, FiMinus, FiSearch, FiPlus } from "react-icons/fi";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SchoolsTabProps } from "@/lib/types/components/modals/provider-details";
import { AssociatedSchool } from "@/lib/types/partners";
import { Input } from "@/components/ui/input";

export const SchoolsTab = ({
  isLoadingSchools,
  associatedSchools,
  schoolSearchQuery,
  setSchoolSearchQuery,
  filteredAvailableSchools,
  setSchoolToRemove,
  setSchoolToAdd,
  applicationStatus,
}: SchoolsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Associated Schools */}
      <div>
        <h4 className="font-semibold mb-3">Associated Schools</h4>
        {isLoadingSchools ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-border mx-auto mb-2"></div>
            <p>Loading schools...</p>
          </div>
        ) : associatedSchools.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FiAward className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
            <p>No schools associated yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {associatedSchools.map((school) => (
              <div
                key={school.id}
                className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-lg hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {school.logo ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-border">
                      <Image
                        src={school.logo}
                        alt={school.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#955aa4] to-[#7a4987] flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg shadow-[#955aa4]/20 border-2 border-border"></div>
                  )}
                  <div>
                    <p className="font-semibold">{school.name}</p>
                  </div>
                </div>
                <Button
                  onClick={() => setSchoolToRemove(school)}
                  variant="ghost"
                  className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-destructive/80 text-destructive hover:bg-destructive/20 transition-colors p-0"
                  aria-label="Remove school"
                >
                  <FiMinus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Schools */}
      <div>
        <h4 className="font-semibold mb-3">Available Schools</h4>
        {isLoadingSchools ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="text"
                placeholder="Search schools..."
                value={schoolSearchQuery}
                onChange={(e) => setSchoolSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 transition-all placeholder-muted"
              />
            </div>

            {filteredAvailableSchools.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {schoolSearchQuery
                  ? "No schools found matching your search."
                  : "All schools are already associated."}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredAvailableSchools.map((school: AssociatedSchool) => {
                  const isRejected = applicationStatus === "REJECTED";
                  return (
                    <div
                      key={school.id}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                        isRejected
                          ? "bg-card border-border opacity-60 cursor-not-allowed"
                          : "bg-muted-foreground/50 border-border/50 hover:bg-muted-foreground/80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {school.logo ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                            <Image
                              src={school.logo}
                              alt={school.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center shrink-0">
                            <FiAward className="w-6 h-6 text-gray-600" />
                          </div>
                        )}
                        <div>
                          <p
                            className={`font-semibold ${isRejected ? "text-gray-500" : "text-gray-900"}`}
                          >
                            {school.name}
                          </p>
                          {isRejected && (
                            <p className="text-xs text-gray-400 mt-1">
                              Cannot add schools to rejected providers
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => !isRejected && setSchoolToAdd(school)}
                        disabled={isRejected}
                        variant="ghost"
                        className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors p-0 ${
                          isRejected
                            ? "border-gray-300 text-gray-400 cursor-not-allowed"
                            : "border-green-400 text-green-500 hover:bg-green-50"
                        }`}
                        aria-label="Add school"
                      >
                        <FiPlus className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
