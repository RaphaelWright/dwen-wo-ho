"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import WidthConstraint from "@/components/ui/width-constraint";
import { ArrowLeft, Users } from "lucide-react";
import { MdSchool } from "react-icons/md";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import useUserQuery from "@/hooks/queries/useUserQuery";

interface Student {
  id: string | number;
  name: string;
  email?: string;
  grade?: string;
  status?: "PENDING" | "ATTENDED" | "MISSED";
  appointmentDate?: string;
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
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);

  useEffect(() => {
    if (schoolId && getProfileQuery.data) {
      loadSchoolDetails();
      loadStudents();
    }
  }, [schoolId, getProfileQuery.data]);

  const loadSchoolDetails = async () => {
    setIsLoading(true);
    try {
      const response = await api(ENDPOINTS.school(schoolId));
      if (response?.success && response.data) {
        setSchool(response.data);
      }
    } catch (error) {
      console.error("Failed to load school details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudents = async () => {
    setStudentsLoading(true);
    try {
      // TODO: Replace with actual endpoint for provider's students in a school
      // For now, using a placeholder endpoint structure
      // const response = await api(ENDPOINTS.providerSchoolStudents(providerEmail, schoolId));
      
      // Mock data structure - replace with actual API call
      const mockStudents: Student[] = [];
      setStudents(mockStudents);
    } catch (error) {
      console.error("Failed to load students:", error);
    } finally {
      setStudentsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <WidthConstraint>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4" />
            <p className="text-gray-500">Loading school details...</p>
          </div>
        </div>
      </WidthConstraint>
    );
  }

  if (!school) {
    return (
      <WidthConstraint>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Button
            onClick={() => router.push("/provider/schools")}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Schools
          </Button>
          <p className="text-gray-500">School not found</p>
        </div>
      </WidthConstraint>
    );
  }

  return (
    <WidthConstraint>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.push("/provider/schools")}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Schools
          </Button>
          
          <div className="flex items-start gap-4">
            {school.logo ? (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                <Image src={school.logo} alt={school.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <MdSchool className="w-10 h-10 text-gray-400" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{school.name}</h1>
              {school.nickname && <p className="text-gray-600">@{school.nickname}</p>}
              {school.type && (
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
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
            My Students
          </h2>

          {studentsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#955aa4] mx-auto mb-4" />
              <p className="text-gray-500">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No students assigned yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#955aa4]/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {student.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      {student.email && <p className="text-sm text-gray-600">{student.email}</p>}
                      {student.grade && <p className="text-sm text-gray-500">Grade {student.grade}</p>}
                    </div>
                  </div>
                  {student.status && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.status === "ATTENDED"
                        ? "bg-green-100 text-green-800"
                        : student.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}>
                      {student.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </WidthConstraint>
  );
}
