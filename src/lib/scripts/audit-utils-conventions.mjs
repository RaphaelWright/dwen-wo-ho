#!/usr/bin/env node
/**
 * Read-only audit of src/lib/utils conventions (AGENTS.md).
 *
 * Usage:
 *   node src/lib/scripts/audit-utils-conventions.mjs
 *   node src/lib/scripts/audit-utils-conventions.mjs --check
 *   node src/lib/scripts/audit-utils-conventions.mjs --review
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");
const UTILS_ROOT = path.join(ROOT, "src/lib/utils");
const UTILS_TS = path.join(ROOT, "src/lib/utils.ts");
const AUDIT_OUT = path.join(ROOT, "docs/utils-conventions-audit.json");

const args = new Set(process.argv.slice(2));
const CHECK = args.has("--check");
const REVIEW = args.has("--review");

const SOURCE_EXT = /\.(tsx?|jsx?)$/;
const CAMEL_BASENAME = /[a-z][A-Z]/;
const UTILS_SUFFIX = /-utils\.(ts|tsx)$/;
const TIME_AGO_PATTERN = /time.?ago|timeago|compacttime/i;

const MICRO_MAX_LINES = 20;
const MICRO_MAX_EXPORTS = 2;
const MICRO_CLUSTER_MIN = 3;

const UTILS_TS_ALLOWED = new Set(["cn"]);

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

function walkUtils(onDir) {
  function visit(absDir, relDir) {
    const entries = listDir(absDir);
    const files = entries.filter((e) => e.isFile() && isSourceFile(e.name));
    const dirs = entries.filter((e) => e.isDirectory());

    onDir({ relDir, files, dirs, absDir });

    for (const d of dirs) {
      visit(path.join(absDir, d.name), normalize(path.join(relDir, d.name)));
    }
  }

  if (!fs.existsSync(UTILS_ROOT)) return;
  visit(UTILS_ROOT, "");
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

function scanTypesInUtils(absPath, relFile) {
  try {
    const content = fs.readFileSync(absPath, "utf8");
    const violations = [];

    for (const match of content.matchAll(
      /export\s+(interface|type)\s+([A-Za-z0-9_]+)/g,
    )) {
      violations.push({
        type: "type-in-utils",
        file: relFile,
        symbol: match[2],
        kind: match[1],
      });
    }

    return violations;
  } catch {
    return [];
  }
}

function auditUtilsTs() {
  const violations = [];

  if (!fs.existsSync(UTILS_TS)) {
    violations.push({ type: "missing-utils-ts", file: "src/lib/utils.ts" });
    return violations;
  }

  const content = fs.readFileSync(UTILS_TS, "utf8");
  const exports = [];

  for (const match of content.matchAll(
    /export\s+(?:const|function)\s+([A-Za-z0-9_]+)/g,
  )) {
    exports.push(match[1]);
  }
  for (const match of content.matchAll(/export\s+\{([^}]+)\}/g)) {
    for (const part of match[1].split(",")) {
      const name = part
        .trim()
        .split(/\s+as\s+/)[0]
        .trim();
      if (name) exports.push(name);
    }
  }

  for (const name of exports) {
    if (!UTILS_TS_ALLOWED.has(name)) {
      violations.push({
        type: "utils-ts-extra-export",
        file: "src/lib/utils.ts",
        symbol: name,
        detail: "lib/utils.ts must export cn() only",
      });
    }
  }

  return violations;
}

function audit() {
  const mixed = [];
  const camelCase = [];
  const utilsSuffix = [];
  const looseRootFiles = [];
  const microFiles = [];
  const microByDir = new Map();
  const typesInUtils = [];
  const timeAgoModules = [];

  walkUtils(({ relDir, files, dirs, absDir }) => {
    if (relDir === "" && files.length > 0 && dirs.length > 0) {
      mixed.push("src/lib/utils");
    }

    if (relDir !== "" && files.length > 0 && dirs.length > 0) {
      mixed.push(normalize(path.join("src/lib/utils", relDir)));
    }

    if (relDir === "" && files.length > 0) {
      for (const file of files) {
        if (!file.name.endsWith(".test.ts")) {
          looseRootFiles.push(normalize(path.join("src/lib/utils", file.name)));
        }
      }
    }

    for (const file of files) {
      const relFile = normalize(path.join("src/lib/utils", relDir, file.name));
      const basename = file.name.replace(SOURCE_EXT, "");

      if (CAMEL_BASENAME.test(basename)) {
        camelCase.push({ file: relFile, basename });
      }

      if (UTILS_SUFFIX.test(file.name)) {
        utilsSuffix.push({ file: relFile });
      }

      if (TIME_AGO_PATTERN.test(basename) && !file.name.endsWith(".test.ts")) {
        timeAgoModules.push(relFile);
      }

      const abs = path.join(absDir, file.name);
      typesInUtils.push(...scanTypesInUtils(abs, relFile));

      if (isMicroFile(abs) && !file.name.endsWith(".test.ts")) {
        const entry = {
          file: relFile,
          lines: countLines(abs),
          exports: countExports(abs),
        };
        microFiles.push(entry);

        const dirKey = normalize(path.join("src/lib/utils", relDir));
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

  const utilsTsViolations = auditUtilsTs();

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      mixedDirectories: mixed.length,
      camelCaseFiles: camelCase.length,
      utilsSuffixFiles: utilsSuffix.length,
      looseRootFiles: looseRootFiles.length,
      microFiles: microFiles.length,
      consolidationClusters: consolidationCandidates.length,
      typesInUtils: typesInUtils.length,
      timeAgoDuplicateModules: timeAgoModules.length,
      utilsTsViolations: utilsTsViolations.length,
    },
    mixed,
    camelCase,
    utilsSuffix,
    looseRootFiles,
    microFiles,
    consolidationCandidates,
    typesInUtils,
    timeAgoDuplicateModules: timeAgoModules,
    utilsTsViolations,
  };
}

function printSummary(report) {
  const { summary } = report;
  console.log("=== Utils conventions audit ===\n");
  console.log(`Mixed directories:       ${summary.mixedDirectories}`);
  console.log(`camelCase files:         ${summary.camelCaseFiles}`);
  console.log(`-utils suffix files:     ${summary.utilsSuffixFiles}`);
  console.log(`Loose root files:        ${summary.looseRootFiles}`);
  console.log(`Micro-files:             ${summary.microFiles}`);
  console.log(`Consolidation clusters:  ${summary.consolidationClusters}`);
  console.log(`Types in utils:          ${summary.typesInUtils}`);
  console.log(`Time-ago modules:        ${summary.timeAgoDuplicateModules}`);
  console.log(`lib/utils.ts violations: ${summary.utilsTsViolations}`);

  if (report.looseRootFiles.length) {
    console.log("\nLoose root files (target: folders-only at root):");
    for (const f of report.looseRootFiles) console.log(`  - ${f}`);
  }

  if (report.camelCase.length) {
    console.log("\ncamelCase filenames:");
    for (const f of report.camelCase) console.log(`  - ${f.file}`);
  }

  if (REVIEW && report.timeAgoDuplicateModules.length > 1) {
    console.log("\nTime-ago duplicate modules:");
    for (const f of report.timeAgoDuplicateModules) console.log(`  - ${f}`);
  }

  if (REVIEW && report.typesInUtils.length) {
    console.log("\nTypes declared in utils:");
    for (const t of report.typesInUtils.slice(0, 15)) {
      console.log(`  - ${t.file}: ${t.symbol}`);
    }
    if (report.typesInUtils.length > 15) {
      console.log(`  ... and ${report.typesInUtils.length - 15} more`);
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
    report.summary.camelCaseFiles > 0 ||
    report.summary.utilsSuffixFiles > 0 ||
    report.summary.looseRootFiles > 0 ||
    report.summary.timeAgoDuplicateModules > 1 ||
    report.summary.utilsTsViolations > 0;

  if (CHECK && hasViolations) {
    process.exit(1);
  }
}

main();
