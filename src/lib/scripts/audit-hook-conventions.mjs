#!/usr/bin/env node
/**
 * Read-only audit of src/hooks conventions (AGENTS.md).
 *
 * Usage:
 *   node src/lib/scripts/audit-hook-conventions.mjs
 *   node src/lib/scripts/audit-hook-conventions.mjs --check
 *   node src/lib/scripts/audit-hook-conventions.mjs --review
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");
const HOOKS_ROOT = path.join(ROOT, "src/hooks");
const COMPONENTS_ROOT = path.join(ROOT, "src/components");
const AUDIT_OUT = path.join(ROOT, "docs/hooks-conventions-audit.json");
const ROLE_MAP_PATH = path.join(__dirname, "hooks-role-rename-map.json");

const args = new Set(process.argv.slice(2));
const CHECK = args.has("--check");
const REVIEW = args.has("--review");

const SOURCE_EXT = /\.(tsx?|jsx?)$/;
const EXCLUDED_NAMES = new Set(["index.ts", "index.tsx"]);

function normalize(rel) {
  return rel.replaceAll("\\", "/");
}

function isSourceFile(name) {
  return SOURCE_EXT.test(name);
}

function isHookFile(name) {
  return (
    isSourceFile(name) &&
    !EXCLUDED_NAMES.has(name) &&
    !name.endsWith(".test.ts")
  );
}

function listDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true });
}

function walkHooks(onDir) {
  function visit(absDir, relDir) {
    const entries = listDir(absDir);
    const files = entries.filter((e) => e.isFile() && isSourceFile(e.name));
    const dirs = entries.filter((e) => e.isDirectory());

    onDir({ relDir, files, dirs });

    for (const d of dirs) {
      visit(path.join(absDir, d.name), normalize(path.join(relDir, d.name)));
    }
  }

  visit(HOOKS_ROOT, "");
}

function parseExportedHookSymbols(absPath) {
  try {
    const content = fs.readFileSync(absPath, "utf8");
    const symbols = new Set();

    for (const match of content.matchAll(
      /export\s+(?:const|function)\s+(use[A-Za-z0-9_]+)/g,
    )) {
      symbols.add(match[1]);
    }

    return [...symbols];
  } catch {
    return [];
  }
}

function detectViolations(relFile, relDir) {
  const violations = [];
  const basename = path.basename(relFile).replace(SOURCE_EXT, "");
  const relPath = normalize(
    path.join("src/hooks", relDir, path.basename(relFile)),
  );

  if (isHookFile(path.basename(relFile)) && !basename.startsWith("use-")) {
    violations.push({
      type: "missing-use-prefix",
      file: relPath,
      detail: `Hook file must use use- prefix: ${basename}`,
    });
  }

  if (
    basename.includes("curator-content-pages") ||
    basename.includes("curator-pages-")
  ) {
    violations.push({
      type: "legacy-prefix",
      file: relPath,
      detail: `Legacy prefix in ${basename}`,
    });
  }

  if (relDir.includes("components/modals")) {
    violations.push({
      type: "stale-modals-tree",
      file: relPath,
      detail: "Stale hooks/components/modals duplicate",
    });
  }

  const parent = path.basename(path.dirname(relPath));
  const domainParents = new Set(["curator", "provider", "patient"]);
  if (domainParents.has(parent) && basename.startsWith(`use-${parent}-`)) {
    violations.push({
      type: "redundant-parent-prefix",
      file: relPath,
      detail: `${basename} repeats parent folder ${parent}`,
      suggested: basename.replace(`use-${parent}-`, "use-"),
    });
  }

  if (relDir === "curator" && basename.startsWith("use-curator-")) {
    violations.push({
      type: "redundant-parent-prefix",
      file: relPath,
      detail: `${basename} repeats curator/ parent`,
      suggested: basename.replace(/^use-curator-/, "use-"),
    });
  }

  if (relDir === "provider" && basename.startsWith("use-provider-")) {
    violations.push({
      type: "redundant-parent-prefix",
      file: relPath,
      detail: `${basename} repeats provider/ parent`,
      suggested: basename.replace(/^use-provider-/, "use-"),
    });
  }

  if (relDir === "patient" && basename.startsWith("use-patient-")) {
    violations.push({
      type: "redundant-parent-prefix",
      file: relPath,
      detail: `${basename} repeats patient/ parent`,
      suggested: basename.replace(/^use-patient-/, "use-"),
    });
  }

  if (basename.includes("-modal-") || basename.endsWith("-modal-state")) {
    violations.push({
      type: "ui-role-drift",
      file: relPath,
      detail: `Modal suffix in hook path; prefer panel/picker role names`,
    });
  }

  const abs = path.join(ROOT, relPath);
  const symbols = parseExportedHookSymbols(abs);
  for (const symbol of symbols) {
    if (
      symbol.includes("Modal") &&
      relPath.includes("provider-details-panel")
    ) {
      violations.push({
        type: "symbol-role-drift",
        file: relPath,
        symbol,
        detail: `${symbol} should use Panel naming for panel UI`,
      });
    }
  }

  return violations;
}

function checkComponentMirrorDrift() {
  const drift = [];
  const compCurator = path.join(COMPONENTS_ROOT, "curator");
  const hooksCompCurator = path.join(HOOKS_ROOT, "components/curator");

  if (!fs.existsSync(hooksCompCurator)) return drift;

  for (const entry of listDir(hooksCompCurator)) {
    if (!entry.isDirectory()) continue;
    const hookFeature = entry.name;
    const compFeature =
      hookFeature === "provider-details" ? "providers" : hookFeature;
    const compPath = path.join(compCurator, compFeature);
    if (hookFeature === "providers") {
      const panelPath = path.join(
        compCurator,
        "providers/provider-details-panel",
      );
      if (!fs.existsSync(panelPath) && hookFeature === "provider-details") {
        drift.push({
          hookPath: `hooks/components/curator/${hookFeature}`,
          detail:
            "No matching components/curator/providers/provider-details-panel",
        });
      }
      continue;
    }
    if (!fs.existsSync(compPath) && hookFeature !== "miscellaneous") {
      drift.push({
        hookPath: `hooks/components/curator/${hookFeature}`,
        detail: `No matching components/curator/${hookFeature}`,
      });
    }
  }

  return drift;
}

function loadExplicitRoleMap() {
  if (!fs.existsSync(ROLE_MAP_PATH)) return { pathRenames: [] };
  return JSON.parse(fs.readFileSync(ROLE_MAP_PATH, "utf8"));
}

function audit() {
  const mixed = [];
  const violations = [];
  const missingUsePrefix = [];

  walkHooks(({ relDir, files, dirs }) => {
    if (files.length > 0 && dirs.length > 0) {
      mixed.push(normalize(path.join("src/hooks", relDir)));
    }

    for (const file of files) {
      const relPath = normalize(path.join("src/hooks", relDir, file.name));
      const found = detectViolations(relPath, relDir);
      violations.push(...found);
      for (const v of found) {
        if (v.type === "missing-use-prefix") missingUsePrefix.push(v);
      }
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

  const componentMirrorDrift = checkComponentMirrorDrift();

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      mixedDirectories: mixed.length,
      conventionViolations: violations.length,
      missingUsePrefix: missingUsePrefix.length,
      explicitRoleRenamesPending: explicitPending.length,
      componentMirrorDrift: componentMirrorDrift.length,
    },
    mixed,
    violations,
    explicitRoleRenamesPending: explicitPending,
    componentMirrorDrift,
  };
}

function printSummary(report) {
  const { summary } = report;
  console.log("=== Hooks conventions audit ===\n");
  console.log(`Mixed directories:     ${summary.mixedDirectories}`);
  console.log(`Convention violations: ${summary.conventionViolations}`);
  console.log(`Missing use- prefix:   ${summary.missingUsePrefix}`);
  console.log(`Explicit role pending: ${summary.explicitRoleRenamesPending}`);
  console.log(`Component mirror drift:${summary.componentMirrorDrift}`);

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
    report.summary.conventionViolations > 0 ||
    report.summary.explicitRoleRenamesPending > 0;

  if (CHECK && hasViolations) {
    process.exit(1);
  }
}

main();
