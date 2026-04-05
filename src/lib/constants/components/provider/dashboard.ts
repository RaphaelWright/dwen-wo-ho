// Provider UI constants formerly stored in mock-provider-data.ts
export const NEW_PROVIDER_STATUS_CHIPS = [
  { id: "all", label: "All Patients", color: "#6366f1" }, // Indigo 500
  { id: "new", label: "New", color: "#10b981" }, // Emerald 500
  { id: "action", label: "Action", color: "#8B5CF6" }, // Violet 500
];

export const NEW_PROVIDER_EDITABLE_FIELDS = [
  {
    key: "title",
    label: "Title",
    hint: "Select from Dr., Prof., Mr., Ms., etc.",
  },
  {
    key: "name",
    label: "Full Name",
    hint: "Your full name as it appears to patients.",
  },
  {
    key: "specialty",
    label: "Specialty",
    hint: "Select your specialty from the list of options.",
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

export const NEW_PROVIDER_LOGOUT_OPTIONS = [
  { icon: "LogOut", label: "Log out of account", danger: false },
  { icon: "SwitchCamera", label: "Switch account", danger: false },
  { icon: "Lock", label: "Lock screen", danger: false },
  { icon: "WifiOff", label: "Go offline", danger: false },
  { icon: "Trash2", label: "Delete account", danger: true },
];

export const NEW_PROVIDER_LOGOUT_ITEMS = [
  { icon: "LogOut", label: "Log out of account", danger: false },
  { icon: "WifiOff", label: "Go offline", danger: false },
];

export const NEW_PROVIDER_FIELD_HOVER = {
  borderColor: "hsl(288 29% 50% / 0.5)",
  backgroundColor: "hsl(288 29% 50% / 0.15)",
};
