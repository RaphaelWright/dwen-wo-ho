import fs from "node:fs";
import path from "node:path";

const files = [
  "c:/Users/Dennis Sekyi - RBSFE/Downloads/drive-download-20260628T014140Z-3-001/Main Patients.html",
  "c:/Users/Dennis Sekyi - RBSFE/Downloads/drive-download-20260628T014140Z-3-001/split-screen (17).html",
  "c:/Users/Dennis Sekyi - RBSFE/Downloads/drive-download-20260628T014140Z-3-001/Patient.Onboarding (20).html",
  "c:/Users/Dennis Sekyi - RBSFE/Downloads/justgo-onboarding-with-popup (11).html",
];

const outDir =
  "C:/Users/Dennis Sekyi - RBSFE/.cursor/projects/c-Users-Dennis-Sekyi-RBSFE-Documents-GitHub-dwen-wo-ho/agent-tools";

for (const file of files) {
  const name = path.basename(file, ".html").replace(/[^\w.-]+/g, "-");
  let content = fs.readFileSync(file, "utf8");
  content = content.replace(/data:image[^"']{50,}/g, "[IMG]");
  content = content.replace(/url\([^)]{100,}\)/g, "url([IMG])");

  const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/);

  if (styleMatch) {
    fs.writeFileSync(
      path.join(outDir, `${name}-styles.css`),
      styleMatch[1].trim(),
    );
  }
  if (bodyMatch) {
    const body = bodyMatch[1].slice(0, 120000);
    fs.writeFileSync(path.join(outDir, `${name}-body.html`), body.trim());
  }
  console.log(
    name,
    styleMatch ? "css" : "no-css",
    bodyMatch ? "body" : "no-body",
  );
}
