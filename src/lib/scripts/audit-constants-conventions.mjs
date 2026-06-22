#!/usr/bin/env node
/**
 * Read-only audit of src/lib/constants conventions (AGENTS.md).
 *
 * Usage:
 *   node src/lib/scripts/audit-constants-conventions.mjs
 *   node src/lib/scripts/audit-constants-conventions.mjs --check
 *   node src/lib/scripts/audit-constants-conventions.mjs --review
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");
const CONSTANTS_ROOT = path.join(ROOT, "src/lib/constants");
const COMPONENTS_ROOT = path.join(ROOT, "src/components");
const AUDIT_OUT = path.join(ROOT, "docs/constants-conventions-audit.json");
const ROLE_MAP_PATH = path.join(__dirname, "constants-role-rename-map.json");

const args = new Set(process.argv.slice(2));
const CHECK = args.has("--check");
const REVIEW = args.has("--review");

const SOURCE_EXT = /\.(tsx?|jsx?)$/;
const MICRO_MAX_LINES = 20;
const MICRO_MAX_EXPORTS = 2;
const MICRO_CLUSTER_MIN = 3;

function normalize(rel) {
  return rel.replaceAll("\\", "/");
}

function isSourceFile(name) {
  return SOURCE_EXT.test(name);
}

function listDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true });
}

function walkConstants(onDir) {
  function visit(absDir, relDir) {
    const entries = listDir(absDir);
    const files = entries.filter((e) => e.isFile() && isSourceFile(e.name));
    const dirs = entries.filter((e) => e.isDirectory());

    onDir({ relDir, files, dirs, absDir });

    for (const d of dirs) {
      visit(path.join(absDir, d.name), normalize(path.join(relDir, d.name)));
    }
  }

  visit(CONSTANTS_ROOT, "");
}

function countLines(absPath) {
  try {
    return fs.readFileSync(absPath, "utf8").split("\n").length;
  } catch {
    return 0;
  }
}

function countExports(absPath) {
  try {
    const content = fs.readFileSync(absPath, "utf8");
    const symbols = new Set();

    for (const match of content.matchAll(
      /export\s+(?:const|type|function|enum)\s+([A-Za-z0-9_]+)/g,
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

    return symbols.size;
  } catch {
    return 0;
  }
}

function isMicroFile(absPath) {
  const lines = countLines(absPath);
  const exports = countExports(absPath);
  return lines <= MICRO_MAX_LINES && exports <= MICRO_MAX_EXPORTS;
}

function detectLegacySegment(relFile) {
  const violations = [];
  const normalized = normalize(relFile);

  if (normalized.includes("/modals/")) {
    violations.push({
      type: "stale-modals-path",
      file: normalized,
      detail: "Legacy modals/ segment; use domain paths",
    });
  }

  const basename = path.basename(relFile).replace(SOURCE_EXT, "");
  if (basename === "create-modal" || basename.includes("curator-pages-")) {
    violations.push({
      type: "legacy-filename",
      file: normalized,
      detail: `Legacy filename ${basename}`,
    });
  }

  return violations;
}

function detectMisplacedRoot(relFile) {
  const violations = [];
  const rel = normalize(relFile);

  if (!rel.startsWith("src/lib/constants/")) return violations;

  const base = path.basename(rel);
  const relFromConstants = rel.slice("src/lib/constants/".length);
  const isRootFile = !relFromConstants.includes("/");

  if (isRootFile && isSourceFile(base)) {
    violations.push({
      type: "misplaced-root",
      file: rel,
      detail:
        "Root lib/constants/ must be folders-only (infra/, components/). Move module into infra/ or components/<domain>/.",
    });
  }

  return violations;
}

function listComponentDirs(relPrefix) {
  const abs = path.join(COMPONENTS_ROOT, relPrefix);
  if (!fs.existsSync(abs)) return new Set();

  return new Set(
    fs
      .readdirSync(abs, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name),
  );
}

function detectMirrorDrift() {
  const drift = [];
  const constantsFeature = path.join(CONSTANTS_ROOT, "components");
  if (!fs.existsSync(constantsFeature)) return drift;

  for (const domain of listDir(constantsFeature).filter((e) =>
    e.isDirectory(),
  )) {
    const constDomainPath = path.join(constantsFeature, domain.name);
    const componentDomainPath = path.join(COMPONENTS_ROOT, domain.name);
    if (!fs.existsSync(componentDomainPath)) continue;

    const constChildren = new Set(
      listDir(constDomainPath)
        .filter((e) => e.isDirectory())
        .map((e) => e.name),
    );
    const compChildren = listComponentDirs(domain.name);

    for (const child of constChildren) {
      if (!compChildren.has(child) && child !== "marketing") {
        drift.push({
          type: "constants-without-component-mirror",
          path: `components/${domain.name}/${child}`,
          detail: `constants mirror missing under src/components/${domain.name}/${child}`,
        });
      }
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
  const pascalCase = [];
  const legacyViolations = [];
  const misplacedRoot = [];
  const microFiles = [];
  const microByDir = new Map();

  walkConstants(({ relDir, files, dirs, absDir }) => {
    if (files.length > 0 && dirs.length > 0) {
      mixed.push(normalize(path.join("src/lib/constants", relDir || ".")));
    }

    for (const file of files) {
      const relFile = normalize(
        path.join("src/lib/constants", relDir, file.name),
      );

      if (/^[A-Z]/.test(file.name)) {
        pascalCase.push({ file: relFile });
      }

      legacyViolations.push(...detectLegacySegment(relFile));
      misplacedRoot.push(...detectMisplacedRoot(relFile));

      const abs = path.join(absDir, file.name);
      if (isMicroFile(abs)) {
        const entry = {
          file: relFile,
          lines: countLines(abs),
          exports: countExports(abs),
        };
        microFiles.push(entry);

        const dirKey = normalize(path.join("src/lib/constants", relDir));
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

  const mirrorDrift = detectMirrorDrift();

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      mixedDirectories: mixed.length,
      pascalCaseFiles: pascalCase.length,
      legacyViolations: legacyViolations.length,
      misplacedRootFiles: misplacedRoot.length,
      microFiles: microFiles.length,
      consolidationClusters: consolidationCandidates.length,
      mirrorDrift: mirrorDrift.length,
      explicitRoleRenamesPending: explicitPending.length,
    },
    mixed,
    pascalCase,
    legacyViolations,
    misplacedRoot,
    microFiles,
    consolidationCandidates,
    mirrorDrift,
    explicitRoleRenamesPending: explicitPending,
  };
}

function printSummary(report) {
  const { summary } = report;
  console.log("=== Constants conventions audit ===\n");
  console.log(`Mixed directories:       ${summary.mixedDirectories}`);
  console.log(`PascalCase files:        ${summary.pascalCaseFiles}`);
  console.log(`Legacy violations:       ${summary.legacyViolations}`);
  console.log(`Misplaced root files:    ${summary.misplacedRootFiles}`);
  console.log(`Micro-files:             ${summary.microFiles}`);
  console.log(`Consolidation clusters:  ${summary.consolidationClusters}`);
  console.log(`Mirror drift:            ${summary.mirrorDrift}`);
  console.log(`Explicit role pending:   ${summary.explicitRoleRenamesPending}`);

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
    report.summary.legacyViolations > 0 ||
    report.summary.misplacedRootFiles > 0 ||
    report.summary.explicitRoleRenamesPending > 0;

  if (CHECK && hasViolations) {
    process.exit(1);
  }
}

main();
