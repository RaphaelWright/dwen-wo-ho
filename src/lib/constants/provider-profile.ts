import { MdSchool } from "react-icons/md";
import { Users, Handshake } from "lucide-react";
import { ProviderStats } from "@/lib/types/provider/profile";

export const getProviderStatItems = (stats: ProviderStats) => [
  {
    label: "Schools",
    value: stats.schools,
    icon: MdSchool,
    bgClass: "bg-blue-100",
    textClass: "text-blue-600",
  },
  {
    label: "Partners",
    value: stats.partners,
    icon: Handshake,
    bgClass: "bg-purple-100",
    textClass: "text-purple-600",
  },
  {
    label: "Total Students",
    value: stats.totalStudents,
    icon: Users,
    bgClass: "bg-green-100",
    textClass: "text-green-600",
  },
  {
    label: "Pending Students",
    value: stats.pendingStudents,
    icon: Users,
    bgClass: "bg-yellow-100",
    textClass: "text-yellow-600",
  },
];
