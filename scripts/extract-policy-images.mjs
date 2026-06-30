import fs from "node:fs";
import path from "node:path";

const htmlPath =
  "c:/Users/Dennis Sekyi - RBSFE/Downloads/justgo-onboarding-with-popup (11).html";
const outDir = path.resolve("public/onboarding/policy");

const html = fs.readFileSync(htmlPath, "utf8");

const sheetCanadaMatch = html.match(/id="sheet"[\s\S]*?id="sheet2"/);
const sheetTermsMatch = html.match(
  /id="sheet2"[\s\S]*?<button class="popup-close-btn" id="closeBtn2"/,
);

if (!sheetCanadaMatch || !sheetTermsMatch) {
  throw new Error("Could not locate policy sheets in HTML");
}

const dataUriPattern = /src="(data:image\/[^;]+;base64,[^"]+)"/g;

function extractImages(section, prefix) {
  const images = [];
  let match;
  while ((match = dataUriPattern.exec(section)) !== null) {
    images.push(match[1]);
  }
  dataUriPattern.lastIndex = 0;
  return images.map((dataUri, index) => {
    const [, mime, base64] = dataUri.match(/^data:(image\/[^;]+);base64,(.+)$/);
    const ext = mime === "image/png" ? "png" : "jpg";
    const filename = `${prefix}-${index + 1}.${ext}`;
    const buffer = Buffer.from(base64, "base64");
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, filename), buffer);
    return `/onboarding/policy/${filename}`;
  });
}

const canadaPaths = extractImages(sheetCanadaMatch[0], "canada");
const termsPaths = extractImages(sheetTermsMatch[0], "terms");

const manifest = {
  canadaUs: canadaPaths,
  terms: termsPaths,
};

fs.writeFileSync(
  path.join(outDir, "manifest.json"),
  JSON.stringify(manifest, null, 2),
);

console.log(JSON.stringify(manifest, null, 2));
