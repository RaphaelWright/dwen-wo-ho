import { ProviderSchoolsHeaderProps } from "@/lib/types/provider/schools";

export function ProviderSchoolsHeader({
  title = "My Schools",
  description = "View and manage your assigned schools",
}: ProviderSchoolsHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
