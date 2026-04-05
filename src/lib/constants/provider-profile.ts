import { MdSchool } from "react-icons/md";
import { Users, Handshake } from "lucide-react";
import { ProviderStats } from "@/lib/types/provider/profile";

/** Available title options for providers */
export const PROVIDER_TITLES = [
  "Dr.",
  "Prof.",
  "Mr.",
  "Mrs.",
  "Ms.",
  "Miss",
  "Mx.",
  "Sir",
  "Rev.",
  "Eng.",
  "PhD",
  "MD",
  "RN",
  "PA",
] as const;

/** Available specialty options for providers */
export const PROVIDER_SPECIALTIES = [
  "Clinical Psychologist",
  "Counseling Psychologist",
  "Psychiatrist",
  "Licensed Therapist (LCSW)",
  "Licensed Mental Health Counselor",
  "Marriage & Family Therapist",
  "Substance Use Counselor",
  "Trauma Specialist",
  "Grief Counselor",
  "Crisis Intervention Specialist",
  "General Practitioner",
  "Student Health Physician",
  "Sports Medicine Doctor",
  "Internal Medicine Physician",
  "Urgent Care Physician",
  "Nurse Practitioner",
  "Physician Assistant",
  "Registered Nurse",
  "Licensed Practical Nurse",
  "Health Educator",
  "Nutritionist / Dietitian",
  "Physical Therapist",
  "Occupational Therapist",
  "Speech Language Pathologist",
  "Audiologist",
  "Optometrist",
  "Dermatologist",
  "Gynecologist / OB-GYN",
  "Neurologist",
  "Gastroenterologist",
  "Wellness Coach",
  "Sexual Health Counselor",
  "Sleep Medicine Specialist",
  "Allergy & Immunology Specialist",
  "Pain Management Specialist",
  "Disability Services Coordinator",
  "Peer Support Specialist",
  "Dentist",
  "Orthodontist",
  "Dental Hygienist",
  "Optician",
] as const;

/** Type for provider titles */
export type ProviderTitle = (typeof PROVIDER_TITLES)[number];

/** Type for provider specialties */
export type ProviderSpecialty = (typeof PROVIDER_SPECIALTIES)[number];

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
    bgClass: "bg-teal-100",
    textClass: "text-teal-600",
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
