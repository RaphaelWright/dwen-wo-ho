export function getColorHex(color: string) {
  let code = "";
  if (color === "yellow") code = "#ff9900";
  if (color === "orange") code = "#f97316";
  if (color === "green") code = "#081c05";
  if (color === "purple") code = "#0d9488";
  if (color === "red") code = "#ff0000";
  if (color === "light green") code = "#66ff66";
  if (color === "black") code = "#000000";
  return code;
}

export function getColorClass(color: string) {
  switch (color) {
    case "red":
      return "bg-red-100 text-red-800";
    case "yellow":
      return "bg-yellow-100 text-yellow-800";
    case "green":
      return "bg-green-100 text-green-800";
    case "purple":
      return "bg-teal-100 text-teal-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getPatientResultColorClass(status: string) {
  switch (status) {
    case "TREATING":
      return "text-green-600 bg-green-100";
    case "PENDING":
      return "text-yellow-600 bg-yellow-100";
    case "COMPLETED":
      return "text-blue-600 bg-blue-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
}
