"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { ArrowLeft, Users } from "lucide-react";
import { MdSchool } from "react-icons/md";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import useUserQuery from "@/hooks/queries/useUserQuery";
import { toast } from "sonner";

interface LockInStudent {
  studentName: string;
  lockinScore: number;
  lockedInInterpretation: string;
  lockedInColor: string;
  lockinId?: number;
  createdAt?: string;
  patientResultId?: number;
  visibilityStatus?: "NEW" | "SEEN";
}

interface LockInData {
  schoolName: string;
  students: LockInStudent[];
}

interface PatientResult {
  id: number;
  lockinId: number;
  schoolId: number;
  schoolName: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
  visibilityStatus: "NEW" | "SEEN";
  starProvider: {
    id: string;
    fullName: string;
    email: string;
    professionalTitle: string;
    specialty: string;
  } | null;
  referredProvider: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  createdAt: string;
  firstOpenedAt: string | null;
  openedByCurrentUser: boolean;
  treatingProviders: Array<{
    id: string;
    fullName: string;
  }>;
}

interface School {
  id: string | number;
  name: string;
  logo?: string;
  type?: string;
  nickname?: string;
}

export default function ProviderSchoolDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;
  const { getProfileQuery } = useUserQuery();

  const [school, setSchool] = useState<School | null>(null);
  const [students, setStudents] = useState<LockInStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  // Check access before loading - redirect if not authorized
  useEffect(() => {
    if (schoolId && getProfileQuery.data) {
      const providerSchools = getProfileQuery.data.schools || [];
      const schoolsArray = Array.isArray(providerSchools) ? providerSchools : [];
      const hasAccess = schoolsArray.some(
        (s: { id: string | number }) => String(s.id) === String(schoolId)
      );

      if (!hasAccess) {
        // Redirect immediately if provider doesn't have access
        router.replace("/provider/schools");
        return;
      }

      // If access is confirmed, load the school details
      loadSchoolDetails();
      loadStudents();
    }
  }, [schoolId, getProfileQuery.data, router]);

  const loadSchoolDetails = async () => {
    setIsLoading(true);
    setAccessDenied(false);
    try {
      const response = await api(ENDPOINTS.school(schoolId));
      if (response?.success && response.data) {
        setSchool(response.data);
      }
    } catch (error) {
      // Check if error is 402 or contains "not permitted" message
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          const isAccessDenied = 
            errorData.message?.includes("not permitted") ||
            errorData.message?.includes("not allowed") ||
            errorData.message?.includes("You're not permitted");
          
          if (isAccessDenied) {
            // Try to redirect first, but keep accessDenied as fallback
            const providerSchools = getProfileQuery.data?.schools || [];
            const schoolsArray = Array.isArray(providerSchools) ? providerSchools : [];
            const hasAccess = schoolsArray.some(
              (s: { id: string | number }) => String(s.id) === String(schoolId)
            );
            
            if (!hasAccess) {
              // Redirect if we can confirm no access
              router.replace("/provider/schools");
              return;
            }
            
            // Fallback: show error message if redirect didn't work
            setAccessDenied(true);
            setSchool(null);
            return;
          }
        } catch {
          // If error message is not JSON, check the raw message
          if (error.message.includes("not permitted") || error.message.includes("not allowed")) {
            // Try to redirect first
            const providerSchools = getProfileQuery.data?.schools || [];
            const schoolsArray = Array.isArray(providerSchools) ? providerSchools : [];
            const hasAccess = schoolsArray.some(
              (s: { id: string | number }) => String(s.id) === String(schoolId)
            );
            
            if (!hasAccess) {
              router.replace("/provider/schools");
              return;
            }
            
            // Fallback: show error message
            setAccessDenied(true);
            setSchool(null);
            return;
          }
        }
      }
      // For other errors, set school to null (will show "not found")
      setSchool(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudents = async () => {
    setStudentsLoading(true);
    try {
      // Fetch lock-in data to get all students
      const lockInResponse = await api(ENDPOINTS.getSchoolLockIn(schoolId));
      if (lockInResponse?.success && lockInResponse.data) {
        const lockInData = lockInResponse.data as LockInData;
        let studentsList = lockInData.students || [];

        // Fetch patient results to match with students and get dates for sorting
        try {
          const resultsResponse = await api(ENDPOINTS.getSchoolPatientResults(schoolId));
          if (resultsResponse?.success && resultsResponse.data) {
            const results = Array.isArray(resultsResponse.data) ? resultsResponse.data : [];
            
            // Create a map of patient name to result for quick lookup
            const resultMap = new Map<string, PatientResult>();
            results.forEach((result: PatientResult) => {
              resultMap.set(result.patientName, result);
            });

            // Enrich students with patient result data
            studentsList = studentsList.map((student) => {
              const result = resultMap.get(student.studentName);
              if (result) {
                return {
                  ...student,
                  lockinId: result.lockinId,
                  createdAt: result.createdAt,
                  patientResultId: result.id,
                  visibilityStatus: result.visibilityStatus,
                };
              }
              return student;
            });
          }
        } catch (error) {
          // Silently handle errors when fetching patient results
        }

        // Sort by creation date (newest first), then by name if no date
        studentsList.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          if (a.createdAt) return -1;
          if (b.createdAt) return 1;
          return a.studentName.localeCompare(b.studentName);
        });

        setStudents(studentsList);
      }
    } catch (error) {
      // Silently handle "No lockins found" - this is expected for schools without lock-ins
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (!errorMessage.includes("No lockins found")) {
        // Only log if it's not the expected "no lockins" case
      }
      setStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleStudentClick = async (student: LockInStudent) => {
    // If patient result exists, navigate to it
    if (student.patientResultId) {
      router.push(`/provider/patients/${student.patientResultId}`);
      return;
    }

    // If no patient result exists, we need to find the lockinId
    // First, try to get it from patient results by matching name
    try {
      const resultsResponse = await api(ENDPOINTS.getSchoolPatientResults(schoolId));
      if (resultsResponse?.success && resultsResponse.data) {
        const results = Array.isArray(resultsResponse.data) ? resultsResponse.data : [];
        const existingResult = results.find((r: PatientResult) => r.patientName === student.studentName);
        if (existingResult) {
          router.push(`/provider/patients/${existingResult.id}`);
          return;
        }
      }
    } catch (error) {
      console.error("Failed to check existing results:", error);
    }

    // If we have lockinId, create patient result
    if (student.lockinId) {
      try {
        const response = await api(ENDPOINTS.createPatientResult, {
          method: "POST",
          body: JSON.stringify({
            lockinId: student.lockinId,
            schoolId: Number(schoolId),
          }),
        });

        if (response?.success) {
          // Fetch the newly created result
          const updatedResults = await api(ENDPOINTS.getSchoolPatientResults(schoolId));
          if (updatedResults?.success && updatedResults.data) {
            const results = Array.isArray(updatedResults.data) ? updatedResults.data : [];
            const result = results.find((r: PatientResult) => r.patientName === student.studentName);
            if (result) {
              router.push(`/provider/patients/${result.id}`);
            } else {
              // Reload and try again
              await loadStudents();
              const studentAfterReload = students.find((s) => s.studentName === student.studentName);
              if (studentAfterReload?.patientResultId) {
                router.push(`/provider/patients/${studentAfterReload.patientResultId}`);
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to create patient result:", error);
        toast.error("Failed to create patient result. Please try again.");
      }
    } else {
      toast.error("Unable to open patient. Lock-in ID not found.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4" />
          <p className="text-gray-500">Loading school details...</p>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-8">
          {/* Back button */}
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
          
          {/* Access denied message centered */}
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <MdSchool className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                You do not have access to this school
              </h2>
              <p className="text-gray-500">
                Please contact your administrator if you believe this is an error.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-8">
          {/* Back button */}
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
          
          {/* School not found message centered */}
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <MdSchool className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                School not found
              </h2>
              <p className="text-gray-500">
                The school you're looking for doesn't exist or has been removed.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-gray-200 bg-white flex-shrink-0">
                <Image src={school.logo} alt={school.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <MdSchool className="w-16 h-16 text-gray-400" />
              </div>
            )}
            <div className="pt-2">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{school.name}</h1>
              {school.nickname && <p className="text-gray-600 text-base">@{school.nickname}</p>}
              {school.type && (
                <span className="inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                  {school.type}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Students Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Students ({students.length})
          </h2>

          {studentsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#955aa4] mx-auto mb-4" />
              <p className="text-gray-500">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No students available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student, index) => (
                <button
                  key={`${student.studentName}-${index}`}
                  onClick={() => handleStudentClick(student)}
                  className="w-full text-left flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#955aa4]/30 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {student.studentName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{student.studentName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          student.lockedInColor === "red" ? "bg-red-100 text-red-800" :
                          student.lockedInColor === "yellow" ? "bg-yellow-100 text-yellow-800" :
                          student.lockedInColor === "green" ? "bg-green-100 text-green-800" :
                          student.lockedInColor === "purple" ? "bg-purple-100 text-purple-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {student.lockedInInterpretation}
                        </span>
                        <span className="text-xs text-gray-500">
                          Score: {student.lockinScore.toFixed(2)}
                        </span>
                      </div>
                      {student.createdAt && (
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {student.visibilityStatus === "NEW" && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        New
                      </span>
                    )}
                    {student.visibilityStatus === "SEEN" && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
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