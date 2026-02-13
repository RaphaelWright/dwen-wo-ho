"use client";

export function ProviderHomeLoading() {
  return (
    <div className="h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4"></div>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
