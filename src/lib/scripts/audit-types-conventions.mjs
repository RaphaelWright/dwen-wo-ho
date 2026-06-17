#!/usr/bin/env node
/**
 * Read-only audit of src/lib/types conventions (AGENTS.md).
 *
 * Usage:
 *   node src/lib/scripts/audit-types-conventions.mjs
 *   node src/lib/scripts/audit-types-conventions.mjs --check
 *   node src/lib/scripts/audit-types-conventions.mjs --review
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");
const TYPES_ROOT = path.join(ROOT, "src/lib/types");
const COMPONENTS_ROOT = path.join(ROOT, "src/components");
const AUDIT_OUT = path.join(ROOT, "docs/types-conventions-audit.json");
const ROLE_MAP_PATH = path.join(__dirname, "types-role-rename-map.json");

const args = new Set(process.argv.slice(2));
const CHECK = args.has("--check");
const REVIEW = args.has("--review");

const SOURCE_EXT = /\.tsx?$/;

const MICRO_MAX_LINES = 20;
const MICRO_MAX_EXPORTS = 2;
const MICRO_CLUSTER_MIN = 3;

function normalize(rel) {
  return rel.replaceAll("\\", "/");
}

function isTypeFile(name) {
  return name.endsWith(".ts");
}

function listDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true });
}

function walkTypes(onDir) {
  function visit(absDir, relDir) {
    const entries = listDir(absDir);
    const files = entries.filter((e) => e.isFile() && isTypeFile(e.name));
    const dirs = entries.filter((e) => e.isDirectory());

    onDir({ relDir, files, dirs, absDir });

    for (const d of dirs) {
      visit(path.join(absDir, d.name), normalize(path.join(relDir, d.name)));
    }
  }

  visit(TYPES_ROOT, "");
}

function walkComponentsTsx(onFile) {
  function visit(absDir, relDir) {
    for (const entry of listDir(absDir)) {
      const rel = normalize(path.join(relDir, entry.name));
      if (entry.isDirectory()) {
        if (rel === "ui" || rel.startsWith("ui/")) continue;
        visit(path.join(absDir, entry.name), rel);
      } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
        onFile(
          normalize(path.join("src/components", rel)),
          path.join(absDir, entry.name),
        );
      }
    }
  }

  visit(COMPONENTS_ROOT, "");
}

function countLines(absPath) {
  try {
    return fs.readFileSync(absPath, "utf8").split("\n").length;
  } catch {
    return 0;
  }
}

function extractExportedNames(content) {
  const symbols = new Set();

  for (const match of content.matchAll(
    /export\s+(?:interface|type|const|function|enum)\s+([A-Za-z0-9_]+)/g,
  )) {
    symbols.add(match[1]);
  }
  for (const match of content.matchAll(/export\s+\{([^}]+)\}/g)) {
    for (const part of match[1].split(",")) {
      const name = part
        .trim()
        .split(/\s+as\s+/)[0]
        .trim();
      if (name) symbols.add(name);
    }
  }

  return symbols;
}

function countExports(absPath) {
  try {
    return extractExportedNames(fs.readFileSync(absPath, "utf8")).size;
  } catch {
    return 0;
  }
}

function isMicroFile(absPath) {
  return (
    countLines(absPath) <= MICRO_MAX_LINES &&
    countExports(absPath) <= MICRO_MAX_EXPORTS
  );
}

function detectLegacySegment(relFile) {
  const violations = [];
  const normalized = normalize(relFile);

  if (normalized.includes("/modals/")) {
    violations.push({
      type: "stale-modals-path",
      file: normalized,
      detail: "Legacy modals/ segment; use domain paths or overlays.ts",
    });
  }

  const basename = path.basename(relFile).replace(SOURCE_EXT, "");
  if (
    basename === "create-modal" ||
    basename === "provider-card" ||
    basename === "school-details-modals" ||
    basename === "modals"
  ) {
    violations.push({
      type: "legacy-filename",
      file: normalized,
      detail: `Legacy filename ${basename}`,
    });
  }

  if (basename.endsWith("Modals") || normalized.includes("/modals.ts")) {
    violations.push({
      type: "ui-role-drift",
      file: normalized,
      detail: "Prefer overlay-host/panel role naming over modals",
    });
  }

  return violations;
}

function detectMisplacedLayer(relFile) {
  const violations = [];
  const rel = normalize(relFile);

  if (
    rel.startsWith("src/lib/types/provider/") &&
    !rel.includes("/signup-resume")
  ) {
    violations.push({
      type: "misplaced-ui-types",
      file: rel,
      detail: "UI prop types belong under lib/types/components/<domain>/",
    });
  }

  if (rel === "src/lib/types/shared-ui.ts") {
    violations.push({
      type: "misplaced-ui-types",
      file: rel,
      detail: "Split into lib/types/components/shared/*",
    });
  }

  if (rel.endsWith(".tsx")) {
    violations.push({
      type: "tsx-in-types",
      file: rel,
      detail: "lib/types uses .ts only",
    });
  }

  return violations;
}

function detectTsxTypeViolations() {
  const violations = [];

  walkComponentsTsx((relFile, absPath) => {
    const content = fs.readFileSync(absPath, "utf8");
    const exports = [...extractExportedNames(content)];

    if (exports.length > 0) {
      violations.push({
        type: "tsx-exported-types",
        file: relFile,
        exports,
      });
    }
  });

  return violations;
}

function detectDuplicateExports() {
  const byName = new Map();

  walkTypes(({ relDir, files, absDir }) => {
    for (const file of files) {
      const relFile = normalize(path.join("src/lib/types", relDir, file.name));
      const content = fs.readFileSync(path.join(absDir, file.name), "utf8");
      for (const name of extractExportedNames(content)) {
        if (!byName.has(name)) byName.set(name, []);
        byName.get(name).push(relFile);
      }
    }
  });

  const duplicates = [];
  for (const [name, files] of byName) {
    if (files.length > 1) {
      duplicates.push({ name, files });
    }
  }

  return duplicates.sort((a, b) => a.name.localeCompare(b.name));
}

function detectRootMixed() {
  const entries = listDir(TYPES_ROOT);
  const files = entries.filter((e) => e.isFile() && isTypeFile(e.name));
  const dirs = entries.filter((e) => e.isDirectory());

  if (files.length > 0 && dirs.length > 0) {
    return [
      {
        directory: "src/lib/types",
        looseFiles: files.map((f) => f.name),
        folders: dirs.map((d) => d.name),
      },
    ];
  }

  return [];
}

function loadExplicitRoleMap() {
  if (!fs.existsSync(ROLE_MAP_PATH))
    return { pathRenames: [], symbolRenames: [] };
  return JSON.parse(fs.readFileSync(ROLE_MAP_PATH, "utf8"));
}

function audit() {
  const mixed = [];
  const pascalCase = [];
  const legacyViolations = [];
  const misplacedLayer = [];
  const microFiles = [];
  const microByDir = new Map();

  walkTypes(({ relDir, files, dirs, absDir }) => {
    if (files.length > 0 && dirs.length > 0) {
      const rel = normalize(path.join("src/lib/types", relDir));
      if (rel !== "src/lib/types") {
        mixed.push(rel);
      }
    }

    for (const file of files) {
      const relFile = normalize(path.join("src/lib/types", relDir, file.name));

      if (/^[A-Z]/.test(file.name)) {
        pascalCase.push({ file: relFile });
      }

      legacyViolations.push(...detectLegacySegment(relFile));
      misplacedLayer.push(...detectMisplacedLayer(relFile));

      const abs = path.join(absDir, file.name);
      if (isMicroFile(abs)) {
        const entry = {
          file: relFile,
          lines: countLines(abs),
          exports: countExports(abs),
        };
        microFiles.push(entry);

        const dirKey = normalize(path.join("src/lib/types", relDir));
        if (!microByDir.has(dirKey)) microByDir.set(dirKey, []);
        microByDir.get(dirKey).push(entry);
      }
    }
  });

  const consolidationCandidates = [];
  for (const [dir, files] of microByDir) {
    if (files.length >= MICRO_CLUSTER_MIN) {
      consolidationCandidates.push({
        directory: dir,
        files: files.map((f) => f.file),
        count: files.length,
      });
    }
  }

  const roleMap = loadExplicitRoleMap();
  const explicitPending = [];

  for (const entry of roleMap.pathRenames ?? []) {
    const from = normalize(entry.from);
    const to = normalize(entry.to);
    const fromExists = fs.existsSync(path.join(ROOT, from));
    const toExists = fs.existsSync(path.join(ROOT, to));

    if (fromExists && !toExists) {
      explicitPending.push({ ...entry, from, to });
    }
  }

  const tsxTypeViolations = detectTsxTypeViolations();
  const duplicateExports = detectDuplicateExports();
  const rootMixed = detectRootMixed();

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      rootMixed: rootMixed.length,
      mixedDirectories: mixed.length + rootMixed.length,
      pascalCaseFiles: pascalCase.length,
      legacyViolations: legacyViolations.length,
      misplacedLayerFiles: misplacedLayer.length,
      microFiles: microFiles.length,
      consolidationClusters: consolidationCandidates.length,
      tsxTypeViolations: tsxTypeViolations.length,
      duplicateExportNames: duplicateExports.length,
      explicitRoleRenamesPending: explicitPending.length,
    },
    rootMixed,
    mixed,
    pascalCase,
    legacyViolations,
    misplacedLayer,
    microFiles,
    consolidationCandidates,
    tsxTypeViolations,
    duplicateExports,
    explicitRoleRenamesPending: explicitPending,
  };
}

function printSummary(report) {
  const { summary } = report;
  console.log("=== Types conventions audit ===\n");
  console.log(`Root mixed:              ${summary.rootMixed}`);
  console.log(`Mixed directories:       ${summary.mixedDirectories}`);
  console.log(`PascalCase files:        ${summary.pascalCaseFiles}`);
  console.log(`Legacy violations:       ${summary.legacyViolations}`);
  console.log(`Misplaced layer files:   ${summary.misplacedLayerFiles}`);
  console.log(`Micro-files:             ${summary.microFiles}`);
  console.log(`Consolidation clusters:  ${summary.consolidationClusters}`);
  console.log(`TSX type violations:     ${summary.tsxTypeViolations}`);
  console.log(`Duplicate export names:  ${summary.duplicateExportNames}`);
  console.log(`Explicit role pending:   ${summary.explicitRoleRenamesPending}`);

  if (report.rootMixed.length) {
    console.log("\nRoot mixed (loose files + folders):");
    for (const d of report.rootMixed) {
      console.log(`  loose: ${d.looseFiles.join(", ")}`);
      console.log(`  folders: ${d.folders.join(", ")}`);
    }
  }

  if (report.mixed.length) {
    console.log("\nMixed directories:");
    for (const d of report.mixed) console.log(`  - ${d}`);
  }

  if (REVIEW && report.consolidationCandidates.length) {
    console.log("\nConsolidation candidates:");
    for (const c of report.consolidationCandidates) {
      console.log(`  ${c.directory} (${c.count} micro-files)`);
    }
  }

  if (REVIEW && report.duplicateExports.length) {
    console.log("\nDuplicate export names:");
    for (const d of report.duplicateExports.slice(0, 15)) {
      console.log(`  ${d.name}: ${d.files.join(", ")}`);
    }
  }

  if (REVIEW && report.tsxTypeViolations.length) {
    console.log("\nTSX exported types (sample):");
    for (const v of report.tsxTypeViolations.slice(0, 10)) {
      console.log(`  ${v.file}: ${v.exports.join(", ")}`);
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
    report.summary.legacyViolations > 0 ||
    report.summary.misplacedLayerFiles > 0 ||
    report.summary.tsxTypeViolations > 0 ||
    report.summary.explicitRoleRenamesPending > 0;

  if (CHECK && hasViolations) {
    process.exit(1);
  }
}

main();
