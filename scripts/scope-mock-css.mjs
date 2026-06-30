import fs from "node:fs";
import path from "node:path";

const input = fs.readFileSync(
  "C:/Users/Dennis Sekyi - RBSFE/.cursor/projects/c-Users-Dennis-Sekyi-RBSFE-Documents-GitHub-dwen-wo-ho/agent-tools/Main-Patients-styles.css",
  "utf8",
);

let css = input
  .replace(/^\s+/gm, "")
  .replace(/:root\s*\{/g, ".patient-onboarding {")
  .replace(/^html,\s*body\s*\{[^}]+\}/m, "")
  .replace(/^\.app\s*\{/m, ".patient-onboarding.app {");

// Scope bare class/id selectors at line start
css = css.replace(/^([.#][\w-][^{]*)\{/gm, (match, selector) => {
  if (selector.startsWith(".patient-onboarding")) return match;
  const parts = selector.split(",").map((s) => {
    const trimmed = s.trim();
    if (trimmed.startsWith(".patient-onboarding")) return trimmed;
    return `.patient-onboarding ${trimmed}`;
  });
  return `${parts.join(", ")} {`;
});

// Fix keyframes and media queries - don't scope @ rules' inner selectors twice
css = css.replace(
  /\.patient-onboarding (@(?:keyframes|media)[^{]+\{[\s\S]*?\})/g,
  "$1",
);

const popupCss = fs.readFileSync(
  "C:/Users/Dennis Sekyi - RBSFE/.cursor/projects/c-Users-Dennis-Sekyi-RBSFE-Documents-GitHub-dwen-wo-ho/agent-tools/justgo-onboarding-with-popup-11--styles.css",
  "utf8",
);

let popupScoped = popupCss
  .replace(/^\s+/gm, "")
  .replace(/:root\s*\{/g, ".patient-onboarding {");

popupScoped = popupScoped.replace(
  /^([.#][\w-][^{]*)\{/gm,
  (match, selector) => {
    if (selector.startsWith(".patient-onboarding")) return match;
    const parts = selector.split(",").map((s) => {
      const trimmed = s.trim();
      if (trimmed.startsWith(".patient-onboarding")) return trimmed;
      return `.patient-onboarding ${trimmed}`;
    });
    return `${parts.join(", ")} {`;
  },
);

const out = `/* Patient onboarding — pixel-match styles from Main Patients.html mock */\n${css}\n\n/* Policy popup sheets from justgo-onboarding-with-popup mock */\n${popupScoped}\n`;

const outPath = path.join(
  process.cwd(),
  "src/styles/patient-onboarding-mock.css",
);
fs.writeFileSync(outPath, out);
console.log("Wrote", outPath, out.length, "bytes");
