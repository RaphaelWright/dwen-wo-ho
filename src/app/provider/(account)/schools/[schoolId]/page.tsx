"use client";

import { ArrowLeft, Users } from "lucide-react";
import { MdSchool } from "react-icons/md";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useProviderSchoolDetails } from "@/hooks/provider/useProviderSchoolDetails";

export default function ProviderSchoolDetailsPage() {
  const {
    router,
    school,
    students,
    isLoading,
    studentsLoading,
    accessDenied,
    handleStudentClick,
  } = useProviderSchoolDetails();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading school details...</p>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <Button
              onClick={() => router.push("/provider/schools")}
              variant="outline"
              className="w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Schools
            </Button>
          </div>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <MdSchool className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                You do not have access to this school
              </h2>
              <p className="text-muted-foreground">
                Please contact your administrator if you believe this is an
                error.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <Button
              onClick={() => router.push("/provider/schools")}
              variant="outline"
              className="w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Schools
            </Button>
          </div>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <MdSchool className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                School not found
              </h2>
              <p className="text-muted-foreground">
                The school you&apos;re looking for doesn&apos;t exist or has
                been removed.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => router.push("/provider/schools")}
            variant="outline"
            className="w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Schools
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6">
            {school.logo ? (
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-border bg-card shrink-0">
                <Image
                  src={school.logo}
                  alt={school.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 bg-muted rounded-2xl flex items-center justify-center shrink-0">
                <MdSchool className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
            <div className="pt-2">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {school.name}
              </h1>
              {school.nickname && (
                <p className="text-muted-foreground text-base">
                  @{school.nickname}
                </p>
              )}
              {school.type && (
                <span className="inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-medium bg-muted text-foreground">
                  {school.type}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Students Section */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Students ({students.length})
          </h2>

          {studentsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No students available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student, index) => (
                <button
                  key={`${student.studentName}-${index}`}
                  onClick={() => handleStudentClick(student)}
                  className="w-full text-left flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {student.studentName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {student.studentName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            student.lockedInColor === "red"
                              ? "bg-destructive/10 text-destructive"
                              : student.lockedInColor === "yellow"
                                ? "bg-yellow-100 text-yellow-800"
                                : student.lockedInColor === "green"
                                  ? "bg-green-100 text-green-800"
                                  : student.lockedInColor === "purple"
                                    ? "bg-teal-500/10 text-teal-700"
                                    : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {student.lockedInInterpretation}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Score: {student.lockinScore.toFixed(2)}
                        </span>
                      </div>
                      {student.createdAt && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {student.visibilityStatus === "NEW" && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                        New
                      </span>
                    )}
                    {student.visibilityStatus === "SEEN" && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        Seen
                      </span>
                    )}
                    {!student.patientResultId && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Not Opened
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
