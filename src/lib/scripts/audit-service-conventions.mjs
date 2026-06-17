#!/usr/bin/env node
/**
 * Read-only audit of src/services conventions (AGENTS.md).
 *
 * Usage:
 *   node src/lib/scripts/audit-service-conventions.mjs
 *   node src/lib/scripts/audit-service-conventions.mjs --check
 *   node src/lib/scripts/audit-service-conventions.mjs --review
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");
const SERVICES_ROOT = path.join(ROOT, "src/services");
const AUDIT_OUT = path.join(ROOT, "docs/services-conventions-audit.json");

const args = new Set(process.argv.slice(2));
const CHECK = args.has("--check");
const REVIEW = args.has("--review");

const SOURCE_EXT = /\.(tsx?|jsx?)$/;
const CAMEL_BASENAME = /[a-z][A-Z]/;
const LEGACY_FOLDERS = new Set(["curator-providers", "provider-dashboard"]);
const LEGACY_ROOT_FILES = new Set([
  "curator-providers.ts",
  "provider-dashboard.ts",
]);
const DOMAIN_FOLDERS = new Set(["shared", "curator", "provider", "patient"]);

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

function walkServices(onDir) {
  function visit(absDir, relDir) {
    const entries = listDir(absDir);
    const files = entries.filter((e) => e.isFile() && isSourceFile(e.name));
    const dirs = entries.filter((e) => e.isDirectory());

    onDir({ relDir, files, dirs, absDir });

    for (const d of dirs) {
      visit(path.join(absDir, d.name), normalize(path.join(relDir, d.name)));
    }
  }

  if (!fs.existsSync(SERVICES_ROOT)) return;
  visit(SERVICES_ROOT, "");
}

function basenameNoExt(name) {
  return name.replace(SOURCE_EXT, "");
}

function isBarrelShim(relDir, fileName) {
  const base = basenameNoExt(fileName);
  const siblingFolder = path.join(SERVICES_ROOT, relDir, base);
  return (
    fs.existsSync(siblingFolder) && fs.statSync(siblingFolder).isDirectory()
  );
}

function hasParentPrefix(fileName, parentFolder) {
  const base = basenameNoExt(fileName);
  const parent = parentFolder.split("/").pop() ?? parentFolder;
  if (!parent) return false;
  return base === parent || base === `${parent}s`;
}

function audit() {
  const mixed = [];
  const camelCase = [];
  const barrelShims = [];
  const legacyFolders = [];
  const legacyRootFiles = [];
  const looseRootFiles = [];
  const parentPrefix = [];
  const missingDomainRoot = [];

  walkServices(({ relDir, files, dirs }) => {
    const relPath = relDir
      ? normalize(path.join("src/services", relDir))
      : "src/services";

    if (files.length > 0 && dirs.length > 0 && !DOMAIN_FOLDERS.has(relDir)) {
      mixed.push(relPath);
    }

    if (relDir === "") {
      for (const d of dirs) {
        if (LEGACY_FOLDERS.has(d.name)) {
          legacyFolders.push(normalize(path.join("src/services", d.name)));
        }
        if (!DOMAIN_FOLDERS.has(d.name) && d.name !== "websocket") {
          // websocket migrates to shared/websocket
          if (d.name === "websocket") {
            legacyFolders.push(normalize(path.join("src/services", d.name)));
          }
        }
      }

      for (const file of files) {
        if (file.name.endsWith(".test.ts")) continue;
        looseRootFiles.push(normalize(path.join("src/services", file.name)));
        if (LEGACY_ROOT_FILES.has(file.name)) {
          legacyRootFiles.push(normalize(path.join("src/services", file.name)));
        }
        if (isBarrelShim(relDir, file.name)) {
          barrelShims.push(normalize(path.join("src/services", file.name)));
        }
      }

      const hasDomainFolder = dirs.some((d) => DOMAIN_FOLDERS.has(d.name));
      if (!hasDomainFolder && dirs.length > 0) {
        missingDomainRoot.push(
          "src/services root has folders but no shared/curator/provider/patient",
        );
      }
    }

    for (const file of files) {
      const relFile = normalize(path.join("src/services", relDir, file.name));
      const base = basenameNoExt(file.name);

      if (CAMEL_BASENAME.test(base)) {
        camelCase.push({ file: relFile, basename: base });
      }

      if (relDir && hasParentPrefix(file.name, relDir)) {
        parentPrefix.push({ file: relFile, parent: relDir.split("/").pop() });
      }

      if (relDir === "" && isBarrelShim("", file.name)) {
        barrelShims.push(relFile);
      }
    }
  });

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      mixedDirectories: mixed.length,
      camelCaseFiles: camelCase.length,
      barrelShims: barrelShims.length,
      legacyFolders: legacyFolders.length,
      legacyRootShims: legacyRootFiles.length,
      looseRootFiles: looseRootFiles.length,
      parentPrefixFiles: parentPrefix.length,
    },
    mixed,
    camelCase,
    barrelShims: [...new Set(barrelShims)],
    legacyFolders,
    legacyRootShims: legacyRootFiles,
    looseRootFiles,
    parentPrefix,
    missingDomainRoot,
  };
}

function printSummary(report) {
  const { summary } = report;
  console.log("=== Services conventions audit ===\n");
  console.log(`Mixed directories:       ${summary.mixedDirectories}`);
  console.log(`camelCase files:         ${summary.camelCaseFiles}`);
  console.log(`Barrel shims:            ${summary.barrelShims}`);
  console.log(`Legacy folders:          ${summary.legacyFolders}`);
  console.log(`Legacy root shims:       ${summary.legacyRootShims}`);
  console.log(`Loose root files:        ${summary.looseRootFiles}`);
  console.log(`Parent-prefix files:     ${summary.parentPrefixFiles}`);

  if (report.looseRootFiles.length) {
    console.log("\nLoose root files (target: domain folders only):");
    for (const f of report.looseRootFiles) console.log(`  - ${f}`);
  }

  if (report.barrelShims.length) {
    console.log("\nBarrel shims (delete after facade import rewrites):");
    for (const f of report.barrelShims) console.log(`  - ${f}`);
  }

  if (REVIEW && report.parentPrefix.length) {
    console.log("\nParent-prefix filenames:");
    for (const f of report.parentPrefix) {
      console.log(`  - ${f.file} (parent: ${f.parent})`);
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
    report.summary.barrelShims > 0 ||
    report.summary.legacyFolders > 0 ||
    report.summary.legacyRootShims > 0 ||
    report.summary.looseRootFiles > 0 ||
    report.summary.parentPrefixFiles > 0;

  if (CHECK && hasViolations) {
    process.exit(1);
  }
}

main();
