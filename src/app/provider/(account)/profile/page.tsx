"use client";

import { useState, useEffect } from "react";
import useUserQuery from "@/hooks/queries/useUserQuery";
import WidthConstraint from "@/components/ui/width-constraint";
import { FiUser, FiMail, FiPhone, FiCalendar, FiAward } from "react-icons/fi";
import { MdSchool } from "react-icons/md";
import { Users, Handshake } from "lucide-react";
import Image from "next/image";
import { formatProviderName, getProviderTitle } from "@/lib/utils/formatProviderName";

export default function ProviderProfilePage() {
  const { getProfileQuery } = useUserQuery();
  const [stats, setStats] = useState({
    schools: 0,
    partners: 0,
    totalStudents: 0,
    pendingStudents: 0,
  });

  useEffect(() => {
    if (getProfileQuery.data) {
      const data = getProfileQuery.data;
      const schools = data.schools || [];
      const partners = data.partners || [];
      
      setStats({
        schools: Array.isArray(schools) ? schools.length : 0,
        partners: Array.isArray(partners) ? partners.length : 0,
        totalStudents: 0, // TODO: Get from API
        pendingStudents: 0, // TODO: Get from API
      });
    }
  }, [getProfileQuery.data]);

  const provider = getProfileQuery.data;

  if (getProfileQuery.isLoading) {
    return (
      <WidthConstraint>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4"></div>
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      </WidthConstraint>
    );
  }

  if (!provider) {
    return (
      <WidthConstraint>
        <div className="text-center py-20">
          <p className="text-gray-500">Failed to load profile</p>
        </div>
      </WidthConstraint>
    );
  }

  return (
    <WidthConstraint>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">View your profile information and statistics</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start gap-6">
            {provider.profilePhotoURL ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                <Image
                  src={provider.profilePhotoURL}
                  alt={formatProviderName(provider.providerName, provider.providerTitle)}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <FiUser className="w-12 h-12 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {formatProviderName(provider.providerName, provider.providerTitle)}
              </h2>
              {provider.specialty && (
                <p className="text-lg text-gray-600 mb-4">{provider.specialty}</p>
              )}
              {provider.status && (
                <p className="text-gray-700 italic mb-4">&quot;{provider.status}&quot;</p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <FiMail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{provider.email}</span>
                </div>
                {provider.officePhoneNumber && (
                  <div className="flex items-center gap-3">
                    <FiPhone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{provider.officePhoneNumber}</span>
                  </div>
                )}
                {provider.applicationDate && (
                  <div className="flex items-center gap-3">
                    <FiCalendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">
                      Joined {new Date(provider.applicationDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <FiAward className="w-5 h-5 text-gray-400" />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    provider.applicationStatus === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : provider.applicationStatus === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}>
                    {provider.applicationStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MdSchool className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.schools}</h3>
            <p className="text-sm text-gray-600">Schools</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Handshake className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.partners}</h3>
            <p className="text-sm text-gray-600">Partners</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalStudents}</h3>
            <p className="text-sm text-gray-600">Total Students</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.pendingStudents}</h3>
            <p className="text-sm text-gray-600">Pending Students</p>
          </div>
        </div>
      </div>
    </WidthConstraint>
  );
}
