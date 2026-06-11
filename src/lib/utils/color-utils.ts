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
