export const GET_COLOR_CLASS = (color: string): string => {
  switch (color.toLowerCase()) {
    case "red":
      return "bg-red-100 text-red-800 border-red-300";
    case "yellow":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "green":
      return "bg-green-100 text-green-800 border-green-300";
    case "purple":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "light green":
      return "bg-green-50 text-green-700 border-green-200";
    case "black":
      return "bg-gray-100 text-gray-800 border-gray-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const PATIENT_DETAILS_TABS = [
  { id: "overview", label: "Overview" },
  { id: "medication", label: "Medication" },
  { id: "visits", label: "Visits" },
  { id: "lab-results", label: "Lab Results" },
  { id: "assessments", label: "Assessments" },
  { id: "vitals", label: "Vitals" },
];
