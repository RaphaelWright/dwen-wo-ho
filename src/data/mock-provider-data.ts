import { AssociatedSchool, AssociatedPartner } from "@/lib/types/partners";
import { NotificationItem } from "@/lib/types/provider/new-provider";
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
  avatar:
    "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=200&h=200&q=80",
  ranking: "3",
  status: "Available for sessions",
  phone: "+233 54 123 4567",
};

export const NEW_PROVIDER_PATIENTS = [
  {
    id: 1,
    name: "Amara Osei-Mensah",
    score: 1.8,
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
    score: 3.2,
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
    score: 7.8,
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
    score: 8.5,
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
    score: 2.9,
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
    score: 6.8,
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
    score: 0.5,
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
    score: 7.1,
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
    score: 5.2,
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
    schoolLabel: "UCC",
    time: "1 min ago",
    score: 0.5,
    emoji: "👨🏽‍🎓",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 1,
    name: "Amara Osei-Mensah",
    school: "ug",
    schoolLabel: "UG",
    time: "2 min ago",
    score: 1.8,
    emoji: "👨🏽‍🎓",
    avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 2,
    name: "Kwame Asante",
    school: "knust",
    schoolLabel: "KNUST",
    time: "14 min ago",
    score: 3.2,
    emoji: "👨🏽‍🎓",
    avatarUrl: "https://randomuser.me/api/portraits/men/29.jpg",
  },
  {
    id: 5,
    name: "Fatima Abubakar",
    school: "upsa",
    schoolLabel: "UPSA",
    time: "5 hr ago",
    score: 2.9,
    emoji: "👨🏽‍🎓",
    avatarUrl: "https://randomuser.me/api/portraits/women/12.jpg",
  },
];

export const NEW_PROVIDER_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: "info",
    message:
      "Crisis alert flagged — expressed thoughts of self-harm. Immediate review required.",
    timestamp: new Date(),
    read: false,
    unread: true,
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    targetName: "Akosua Yeboah",
    targetSchoolId: "ucc",
    targetSchoolName: "UCC",
    text: "Crisis alert flagged — expressed thoughts of self-harm. Immediate review required.",
    meta: "18 min ago · Urgent",
    targetId: "7",
    targetType: "patient",
  },
  {
    id: 2,
    type: "info",
    message:
      "New urgent case submitted. Severe anxiety affecting daily functioning.",
    timestamp: new Date(),
    read: false,
    unread: true,
    avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    targetName: "Amara Osei-Mensah",
    targetSchoolId: "ug",
    targetSchoolName: "UG",
    text: "New urgent case submitted. Severe anxiety affecting daily functioning.",
    meta: "2 min ago · New Case",
    targetId: "1",
    targetType: "patient",
  },
  {
    id: 3,
    type: "info",
    message:
      "Treatment milestone reached. Week 4 CBT session completed successfully.",
    timestamp: new Date(),
    read: false,
    unread: true,
    avatarUrl: "https://randomuser.me/api/portraits/women/12.jpg",
    targetName: "Selina Boateng",
    targetSchoolId: "ucc",
    targetSchoolName: "UCC",
    text: "Treatment milestone reached. Week 4 CBT session completed successfully.",
    meta: "1 hr ago · Milestone",
    targetId: "3",
    targetType: "patient",
  },
  {
    id: 4,
    type: "info",
    message:
      "You have been added to UG as a care provider. 9 patients are now visible.",
    timestamp: new Date(),
    read: false,
    unread: true,
    avatarUrl:
      "https://upload.wikimedia.org/wikipedia/en/e/e9/University_of_Ghana_logo.png",
    targetName: "University of Ghana",
    text: "You have been added to UG as a care provider. 9 patients are now visible.",
    meta: "Yesterday · School Update",
    targetId: "ug",
    targetType: "school",
  },
  {
    id: 5,
    type: "info",
    message:
      "New referral from campus counselor. High risk score — early assessment recommended.",
    timestamp: new Date(),
    read: false,
    unread: true,
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    targetName: "Fatima Abubakar",
    targetSchoolId: "upsa",
    targetSchoolName: "UPSA",
    text: "New referral from campus counselor. High risk score — early assessment recommended.",
    meta: "5 hr ago · Referral",
    targetId: "5",
    targetType: "patient",
  },
  {
    id: 6,
    type: "info",
    message: "Clinical review meeting scheduled for next Tuesday at 2 PM.",
    timestamp: new Date(),
    read: true,
    unread: false,
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    targetName: "Nana Adjei",
    targetSchoolId: "ug",
    targetSchoolName: "UG",
    text: "Follow-up check-in completed. Patient reports improved mood and sleep quality.",
    meta: "3 days ago · Follow-up",
    targetId: "4",
    targetType: "patient",
  },
];

export const NEW_PROVIDER_SCHOOLS = [
  { id: "all", label: "All Schools", count: 32 },
  {
    id: "knust",
    label: "KNUST",
    count: 8,
    hasNotif: true,
    avatarUrl:
      "https://upload.wikimedia.org/wikipedia/en/5/52/Kwame_Nkrumah_University_of_Science_and_Technology_logo.png",
  },
  {
    id: "ucc",
    label: "UCC",
    count: 7,
    hasNotif: false,
    avatarUrl:
      "https://upload.wikimedia.org/wikipedia/en/e/e5/University_of_Cape_Coast_logo.png",
  },
  {
    id: "ug",
    label: "UG",
    count: 9,
    hasNotif: true,
    avatarUrl:
      "https://upload.wikimedia.org/wikipedia/en/e/e9/University_of_Ghana_logo.png",
  },
  {
    id: "upsa",
    label: "UPSA",
    count: 4,
    hasNotif: false,
    avatarUrl:
      "https://upload.wikimedia.org/wikipedia/en/6/6f/University_of_Professional_Studies%2C_Accra_logo.png",
  },
  {
    id: "uds",
    label: "UDS",
    count: 4,
    hasNotif: false,
    avatarUrl:
      "https://upload.wikimedia.org/wikipedia/en/3/36/University_for_Development_Studies_logo.png",
  },
];

export const NEW_PROVIDER_STATUS_CHIPS = [
  { id: "all", label: "All Patients", color: "#6366f1" }, // Indigo 500
  { id: "new", label: "New", color: "#10b981" }, // Emerald 500
  { id: "action", label: "Action", color: "#8B5CF6" }, // Violet 500
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
    name: "KNUST School of Medicine",
    primaryColor: "hsl(348 83% 47%)",
  },
  {
    name: "UCC School of Medical Sciences",
    primaryColor: "hsl(210 100% 50%)",
  },
  {
    name: "University of Ghana Medical School",
    primaryColor: "hsl(200 100% 45%)",
  },
  { name: "UPSA Clinic", primaryColor: "hsl(220 80% 40%)" },
  {
    name: "UDS School of Medicine",
    primaryColor: "hsl(0 80% 40%)",
  },
];

/** Logout menu items */
export const NEW_PROVIDER_LOGOUT_OPTIONS = [
  { icon: "LogOut", label: "Log out of account", danger: false },
  { icon: "SwitchCamera", label: "Switch account", danger: false },
  { icon: "Lock", label: "Lock screen", danger: false },
  { icon: "WifiOff", label: "Go offline", danger: false },
  { icon: "Trash2", label: "Delete account", danger: true },
];
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
