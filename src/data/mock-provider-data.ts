import { AssociatedSchool, AssociatedPartner } from "@/lib/types/provider";
import { LogOut, WifiOff } from "lucide-react";

export const mockSchools: AssociatedSchool[] = [
  {
    id: "1",
    name: "Achimota High School",
    joinedDate: "3d ago",
    isAssociated: true,
  },
  {
    id: "2",
    name: "Prempeh College",
    joinedDate: "1w ago",
    isAssociated: true,
  },
  {
    id: "3",
    name: "Wesley Girls High School",
    joinedDate: "2w ago",
    isAssociated: false,
  },
];

export const mockPartners: AssociatedPartner[] = [
  {
    id: "1",
    name: "SRC Prempeh College",
    joinedDate: "3d ago",
    isAssociated: true,
  },
  {
    id: "2",
    name: "OKB Hope Foundation",
    joinedDate: "1w ago",
    isAssociated: true,
  },
  {
    id: "3",
    name: "Mental Health Authority",
    joinedDate: "2w ago",
    isAssociated: false,
  },
];

export const DEFAULT_PROVIDER_PROFILE = {
  title: "Dr.",
  name: "James Okonkwo",
  specialty: "Clinical Psychologist",
  status: "Let's talk mental health",
  phone: "+1 617 555 0123",
};

export const NEW_PROVIDER_PATIENTS = [
  {
    id: 1,
    name: "Amara Osei-Mensah",
    score: 9.2,
    status: "urgent",
    school: "ug",
    schoolLabel: "UG",
    time: "2 min ago",
    preview:
      "Reports severe anxiety, unable to attend classes — requesting immediate support.",
    emoji: "👨🏽‍🎓",
  },
  {
    id: 2,
    name: "Kwame Asante",
    score: 7.4,
    status: "new",
    school: "knust",
    schoolLabel: "KNUST",
    time: "14 min ago",
    preview:
      "First-time submission. Describes persistent low mood and difficulty sleeping for 3 weeks.",
    emoji: "👨🏽‍🎓",
  },
  {
    id: 3,
    name: "Selina Boateng",
    score: 6.0,
    status: "action",
    school: "ucc",
    schoolLabel: "UCC",
    time: "1 hr ago",
    preview:
      "Week 4 of CBT. Responding positively. Next session scheduled Friday.",
    emoji: "👨🏽‍🎓",
  },
  {
    id: 4,
    name: "Nana Adjei",
    score: 4.9,
    status: "follow-up",
    school: "ug",
    schoolLabel: "UG",
    time: "3 hr ago",
    preview:
      "Post-referral check-in due. Steady improvement noted in last two sessions.",
    emoji: "👨🏽‍🎓",
  },
  {
    id: 5,
    name: "Fatima Abubakar",
    score: 8.2,
    status: "new",
    school: "upsa",
    schoolLabel: "UPSA",
    time: "5 hr ago",
    preview:
      "Referred by campus counselor. Social withdrawal, academic performance decline.",
    emoji: "👨🏽‍🎓",
  },
  {
    id: 6,
    name: "Emmanuel Darko",
    score: 6.6,
    status: "referred",
    school: "knust",
    schoolLabel: "KNUST",
    time: "Yesterday",
    preview:
      "Referred to Dr. Bempah (Psychiatry) for medication evaluation. Continuing counselling.",
    emoji: "👨🏽‍🎓",
  },
  {
    id: 7,
    name: "Akosua Yeboah",
    score: 9.7,
    status: "urgent",
    school: "ucc",
    schoolLabel: "UCC",
    time: "18 min ago",
    preview:
      "Crisis alert flagged. Expressed thoughts of self-harm — urgent intervention required.",
    emoji: "👨🏽‍🎓",
  },
  {
    id: 8,
    name: "Daniel Mensah-Bonsu",
    score: 5.7,
    status: "action",
    school: "uds",
    schoolLabel: "UDS",
    time: "2 days ago",
    preview:
      "Mid-cycle review. Stress management techniques showing measurable results.",
    emoji: "👨🏽‍🎓",
  },
  {
    id: 9,
    name: "Aisha Mohammed",
    score: 4.1,
    status: "ignored",
    school: "knust",
    schoolLabel: "KNUST",
    time: "3 days ago",
    preview:
      "Case opened but no action taken. Student not yet responsive to initial outreach.",
    emoji: "👨🏽‍🎓",
  },
];

export const NEW_PROVIDER_URGENT_PATIENTS = [
  {
    id: 7,
    name: "Akosua Yeboah",
    school: "ucc",
    schoolLabel: "UCC · Crisis Alert",
    time: "18 min ago",
    score: 9.7,
    color: "red",
    emoji: "👨🏽‍🎓",
  },
  {
    id: 1,
    name: "Amara Osei-Mensah",
    school: "ug",
    schoolLabel: "UG · Severe Anxiety",
    time: "2 min ago",
    score: 9.2,
    color: "red",
    emoji: "👨🏽‍🎓",
  },
  {
    id: 2,
    name: "Kwame Asante",
    school: "knust",
    schoolLabel: "KNUST · New Intake",
    time: "14 min ago",
    score: 7.4,
    color: "amber",
    emoji: "👨🏽‍🎓",
  },
  {
    id: 5,
    name: "Fatima Abubakar",
    school: "upsa",
    schoolLabel: "UPSA · Intake",
    time: "5 hr ago",
    score: 8.2,
    color: "amber",
    emoji: "👨🏽‍🎓",
  },
];

export const NEW_PROVIDER_NOTIFICATIONS = [
  {
    id: 1,
    unread: true,
    emoji: "👨🏽‍🎓",
    patient: "Akosua Yeboah · UCC",
    text: "Crisis alert flagged — expressed thoughts of self-harm. Immediate review required.",
    meta: "18 min ago · Urgent",
  },
  {
    id: 2,
    unread: true,
    emoji: "👨🏽‍🎓",
    patient: "Amara Osei-Mensah · UG",
    text: "New urgent case submitted. Severe anxiety affecting daily functioning.",
    meta: "2 min ago · New Case",
  },
  {
    id: 3,
    unread: true,
    emoji: "👨🏽‍🎓",
    patient: "Selina Boateng · UCC",
    text: "Treatment milestone reached. Week 4 CBT session completed successfully.",
    meta: "1 hr ago · Milestone",
  },
  {
    id: 4,
    unread: true,
    emoji: "👨🏽‍🎓",
    patient: "University of Ghana",
    text: "You have been added to UG as a care provider. 9 patients are now visible.",
    meta: "Yesterday · School Update",
  },
  {
    id: 5,
    unread: true,
    emoji: "👨🏽‍🎓",
    patient: "Fatima Abubakar · UPSA",
    text: "New referral from campus counselor. High risk score — early assessment recommended.",
    meta: "5 hr ago · Referral",
  },
  {
    id: 6,
    unread: false,
    emoji: "👨🏽‍🎓",
    patient: "Nana Adjei · UG",
    text: "Follow-up check-in completed. Patient reports improved mood and sleep quality.",
    meta: "3 days ago · Follow-up",
  },
];

export const NEW_PROVIDER_SCHOOLS = [
  { id: "all", label: "All Schools", count: 32 },
  {
    id: "knust",
    label: "KNUST",
    count: 8,
    letter: "KN",
    colors: {
      bg: "hsl(348 83% 47% / 0.15)", // Crimson Red
      border: "hsl(348 83% 47% / 0.3)",
      text: "hsl(348 83% 47%)",
    },
    hasNotif: true,
  },
  {
    id: "ucc",
    label: "UCC",
    count: 7,
    letter: "UC",
    colors: {
      bg: "hsl(210 100% 50% / 0.15)", // Blue
      border: "hsl(210 100% 50% / 0.3)",
      text: "hsl(210 100% 50%)",
    },
    hasNotif: false,
  },
  {
    id: "ug",
    label: "UG",
    count: 9,
    letter: "UG",
    colors: {
      bg: "hsl(200 100% 45% / 0.15)", // Light Blue
      border: "hsl(200 100% 45% / 0.3)",
      text: "hsl(200 100% 45%)",
    },
    hasNotif: true,
  },
  {
    id: "upsa",
    label: "UPSA",
    count: 4,
    letter: "UP",
    colors: {
      bg: "hsl(220 80% 40% / 0.15)", // Darker Blue
      border: "hsl(220 80% 40% / 0.3)",
      text: "hsl(220 80% 40%)",
    },
    hasNotif: false,
  },
  {
    id: "uds",
    label: "UDS",
    count: 4,
    letter: "UD",
    colors: {
      bg: "hsl(0 80% 40% / 0.15)", // Crimson
      border: "hsl(0 80% 40% / 0.3)",
      text: "hsl(0 80% 40%)",
    },
    hasNotif: false,
  },
];

export const NEW_PROVIDER_STATUS_CHIPS = [
  { id: "all", label: "All Patients", color: "#6366f1" }, // Indigo 500
  { id: "new", label: "New", color: "#10b981" }, // Emerald 500
  { id: "action", label: "In Treatment", color: "#8B5CF6" }, // Violet 500
  { id: "follow-up", label: "Follow-up", color: "#f59e0b" }, // Amber 500
  { id: "referred", label: "Referred", color: "#38bdf8" }, // Sky 400
  { id: "urgent", label: "Urgent", color: "#ef4444" }, // Red 500
  { id: "ignored", label: "Ignored", color: "#555e72" }, // Slate 500
];

export const NEW_PROVIDER_EDITABLE_FIELDS = [
  { key: "title", label: "Title", hint: "e.g. Dr., Prof., Mr., Ms." },
  {
    key: "name",
    label: "Full Name",
    hint: "Your full name as it appears to patients.",
  },
  {
    key: "specialty",
    label: "Specialty",
    hint: "e.g. Clinical Psychologist, Psychiatrist",
  },
  {
    key: "status",
    label: "Status",
    hint: "Your status message. Emojis are welcome!",
  },
  {
    key: "phone",
    label: "Phone",
    hint: "Include country code, e.g. +1 617 555 0123",
  },
];

/** Schools shown in the Profile → Schools tab */
export const NEW_PROVIDER_ASSIGNED_SCHOOLS = [
  {
    letter: "KN",
    name: "KNUST School of Medicine",
    color: "hsl(348 83% 47%)",
  },
  {
    letter: "UC",
    name: "UCC School of Medical Sciences",
    color: "hsl(210 100% 50%)",
  },
  {
    letter: "UG",
    name: "University of Ghana Medical School",
    color: "hsl(200 100% 45%)",
  },
  { letter: "UP", name: "UPSA Clinic", color: "hsl(220 80% 40%)" },
  { letter: "UD", name: "UDS School of Medicine", color: "hsl(0 80% 40%)" },
];

/** Logout menu items */
export const NEW_PROVIDER_LOGOUT_OPTIONS = [
  { icon: "LogOut", label: "Log out of account", danger: false },
  { icon: "SwitchCamera", label: "Switch account", danger: false },
  { icon: "Lock", label: "Lock screen", danger: false },
  { icon: "WifiOff", label: "Go offline", danger: false },
  { icon: "Trash2", label: "Delete account", danger: true },
];

export const NEW_PROVIDER_COLORS = {
  red: {
    dot: "hsl(var(--destructive))",
    score: "hsl(var(--destructive))",
    scoreBg: "hsl(var(--destructive) / 0.13)",
    border: "hsl(var(--destructive) / 0.3)",
  },
  amber: {
    dot: "hsl(38 92% 50%)",
    score: "hsl(38 92% 50%)",
    scoreBg: "hsl(38 92% 50% / 0.13)",
    border: "hsl(38 92% 50% / 0.3)",
  },
};

export const NEW_PROVIDER_LOGOUT_ITEMS = [
  { icon: LogOut, label: "Log out of account", danger: false },
  { icon: WifiOff, label: "Go offline", danger: false },
];

export const NEW_PROVIDER_READ_ONLY_FIELDS = [
  { label: "Email", value: "james@justgohealth.com" },
  { label: "Member Since", value: "Feb 7, 2026" },
  { label: "Last Updated", value: "2 weeks ago" },
];

export const NEW_PROVIDER_FIELD_HOVER = {
  borderColor: "hsl(var(--primary) / 0.5)",
  backgroundColor: "hsl(var(--primary) / 0.15)",
};
