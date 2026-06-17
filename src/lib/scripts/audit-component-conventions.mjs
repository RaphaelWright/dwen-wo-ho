#!/usr/bin/env node
/**
 * Read-only audit of src/components conventions (AGENTS.md).
 *
 * Usage:
 *   node src/lib/scripts/audit-component-conventions.mjs
 *   node src/lib/scripts/audit-component-conventions.mjs --check
 *   node src/lib/scripts/audit-component-conventions.mjs --include-ui
 *   node src/lib/scripts/audit-component-conventions.mjs --review
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");
const COMPONENTS_ROOT = path.join(ROOT, "src/components");
const AUDIT_OUT = path.join(ROOT, "docs/components-conventions-audit.json");
const ROLE_MAP_PATH = path.join(__dirname, "components-role-rename-map.json");

const args = new Set(process.argv.slice(2));
const CHECK = args.has("--check");
const INCLUDE_UI = args.has("--include-ui");
const REVIEW = args.has("--review");

const SOURCE_EXT = /\.(tsx?|jsx?)$/;

function normalize(rel) {
  return rel.replaceAll("\\", "/");
}

function pascalToKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function isSourceFile(name) {
  return SOURCE_EXT.test(name);
}

function listDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true });
}

function walkComponents(onDir) {
  function visit(absDir, relDir) {
    if (!INCLUDE_UI && relDir === "ui") return;

    const entries = listDir(absDir);
    const files = entries.filter((e) => e.isFile() && isSourceFile(e.name));
    const dirs = entries.filter((e) => e.isDirectory());

    onDir({ relDir, files, dirs });

    for (const d of dirs) {
      visit(path.join(absDir, d.name), normalize(path.join(relDir, d.name)));
    }
  }

  visit(COMPONENTS_ROOT, "");
}

function isShimFile(absPath) {
  const base = path.basename(absPath);
  if (base === "index.tsx" || base === "index.ts") {
    return false;
  }

  try {
    const content = fs.readFileSync(absPath, "utf8").trim();
    return /^export\s+\{[^}]+\}\s+from\s+["']\.\/[^"']+["'];?$/.test(content);
  } catch {
    return false;
  }
}

function parseExportedSymbols(absPath) {
  try {
    const content = fs.readFileSync(absPath, "utf8");
    const symbols = new Set();

    for (const match of content.matchAll(
      /export\s+default\s+function\s+([A-Za-z0-9_]+)/g,
    )) {
      symbols.add(match[1]);
    }
    for (const match of content.matchAll(
      /export\s+function\s+([A-Za-z0-9_]+)/g,
    )) {
      symbols.add(match[1]);
    }
    for (const match of content.matchAll(/export\s+\{\s*([A-Za-z0-9_]+)/g)) {
      symbols.add(match[1]);
    }

    return [...symbols];
  } catch {
    return [];
  }
}

const SUFFIX_ROLE_MAP = {
  Panel: "-panel",
  Dialog: "-dialog",
  Wizard: "-wizard",
  Overlay: "-overlay",
  Host: "-host",
  Launcher: "-launcher",
  Picker: "-picker",
};

function detectRoleViolations(relFile, symbols) {
  const violations = [];
  const basename = path.basename(relFile).replace(SOURCE_EXT, "");

  if (
    basename.includes("curator-pages-") ||
    basename.includes("content-pages-")
  ) {
    violations.push({
      type: "legacy-prefix",
      file: relFile,
      detail: `Legacy prefix in ${basename}`,
    });
  }

  const parent = path.basename(path.dirname(relFile));
  if (parent && basename.startsWith(`${parent}-`)) {
    violations.push({
      type: "redundant-parent-prefix",
      file: relFile,
      detail: `${basename} repeats parent folder ${parent}`,
      suggested: basename.slice(parent.length + 1),
    });
  }

  if (basename.startsWith("provider-") && relFile.includes("/provider/new/")) {
    violations.push({
      type: "redundant-domain-prefix",
      file: relFile,
      detail: `provider- prefix inside provider/new/`,
      suggested: basename.replace(/^provider-/, ""),
    });
  }

  if (!basename.includes("-modal") && !basename.includes("-modals")) {
    return violations;
  }

  for (const symbol of symbols) {
    for (const [suffix, roleSuffix] of Object.entries(SUFFIX_ROLE_MAP)) {
      if (!symbol.endsWith(suffix)) continue;
      if (basename.endsWith("-modals") && roleSuffix === "-host") {
        violations.push({
          type: "overlay-host",
          file: relFile,
          symbol,
          detail: `${basename} exports ${symbol}; consider *-overlay-host`,
        });
        continue;
      }
      if (
        basename.includes("-modal") &&
        !basename.includes(roleSuffix.slice(1))
      ) {
        violations.push({
          type: "wrong-suffix",
          file: relFile,
          symbol,
          detail: `Path ${basename} vs symbol ${symbol} (${suffix})`,
          suggestedSuffix: roleSuffix,
        });
      }
    }
  }

  if (basename.endsWith("-modals")) {
    violations.push({
      type: "overlay-host",
      file: relFile,
      detail: `*-modals.tsx likely overlay host`,
    });
  }

  return violations;
}

function loadExplicitRoleMap() {
  if (!fs.existsSync(ROLE_MAP_PATH)) return { pathRenames: [] };
  return JSON.parse(fs.readFileSync(ROLE_MAP_PATH, "utf8"));
}

function audit() {
  const mixed = [];
  const pascalCase = [];
  const shims = [];
  const collisions = [];
  const roleViolations = [];

  walkComponents(({ relDir, files, dirs }) => {
    if (files.length > 0 && dirs.length > 0) {
      mixed.push(normalize(path.join("src/components", relDir)));
    }

    const dirNames = new Set(dirs.map((d) => d.name));

    for (const file of files) {
      const relFile = normalize(path.join("src/components", relDir, file.name));
      const base = file.name.replace(SOURCE_EXT, "");

      if (/^[A-Z]/.test(file.name)) {
        pascalCase.push({
          file: relFile,
          suggested: `${pascalToKebab(base)}${path.extname(file.name)}`,
        });
      }

      if (dirNames.has(base)) {
        collisions.push(relFile);
      }

      const abs = path.join(COMPONENTS_ROOT, relDir, file.name);
      if (isShimFile(abs)) {
        shims.push(relFile);
      }

      const symbols = parseExportedSymbols(abs);
      roleViolations.push(...detectRoleViolations(relFile, symbols));
    }
  });

  const roleMap = loadExplicitRoleMap();
  const explicitPending = [];

  for (const entry of roleMap.pathRenames ?? []) {
    const from = normalize(entry.from);
    const to = normalize(entry.to);
    const fromExists =
      fs.existsSync(path.join(ROOT, from)) ||
      fs.existsSync(path.join(ROOT, from.replace(/\/$/, "")));
    const toExists = fs.existsSync(path.join(ROOT, to));

    if (fromExists && !toExists) {
      explicitPending.push({ ...entry, from, to });
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      mixedDirectories: mixed.length,
      pascalCaseFiles: pascalCase.length,
      shimFiles: shims.length,
      nameCollisions: collisions.length,
      heuristicRoleViolations: roleViolations.length,
      explicitRoleRenamesPending: explicitPending.length,
    },
    mixed,
    pascalCase,
    shims,
    collisions,
    roleViolations,
    explicitRoleRenamesPending: explicitPending,
  };
}

function printSummary(report) {
  const { summary } = report;
  console.log("=== Components conventions audit ===\n");
  console.log(`Mixed directories:     ${summary.mixedDirectories}`);
  console.log(`PascalCase files:      ${summary.pascalCaseFiles}`);
  console.log(`Re-export shims:       ${summary.shimFiles}`);
  console.log(`Name collisions:       ${summary.nameCollisions}`);
  console.log(`Role heuristics:       ${summary.heuristicRoleViolations}`);
  console.log(`Explicit role pending: ${summary.explicitRoleRenamesPending}`);

  if (report.mixed.length) {
    console.log("\nMixed directories:");
    for (const d of report.mixed) console.log(`  - ${d}`);
  }

  if (REVIEW && report.explicitRoleRenamesPending.length) {
    console.log("\nExplicit role renames pending:");
    for (const e of report.explicitRoleRenamesPending) {
      console.log(`  ${e.from} -> ${e.to} (${e.reason})`);
    }
  }
}

function main() {
  const report = audit();
  fs.mkdirSync(path.dirname(AUDIT_OUT), { recursive: true });
  fs.writeFileSync(AUDIT_OUT, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  printSummary(report);
  console.log(`\nWrote ${normalize(path.relative(ROOT, AUDIT_OUT))}`);

  const hasViolations =
    report.summary.mixedDirectories > 0 ||
    report.summary.pascalCaseFiles > 0 ||
    report.summary.shimFiles > 0 ||
    report.summary.nameCollisions > 0 ||
    report.summary.explicitRoleRenamesPending > 0;

  if (CHECK && hasViolations) {
    process.exit(1);
  }
}

main();
