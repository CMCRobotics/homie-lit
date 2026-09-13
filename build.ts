import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const distDir = path.join(import.meta.dir, "dist");

// 1. Clean up dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 2. Generate TypeScript declaration files (.d.ts) using tsc
console.log("Generating TypeScript declarations...");
try {
  execSync("bun x tsc --emitDeclarationOnly --outDir dist", { stdio: "inherit" });
} catch (e) {
  console.error("Failed to generate type declarations:", e);
  process.exit(1);
}

// 3. Helper to write builds
async function runBuild(options: {
  entrypoint?: string;
  minify?: boolean;
  external?: string[];
  format: "esm" | "cjs";
  outputName: string;
}) {
  const result = await Bun.build({
    entrypoints: [options.entrypoint ?? "./src/index.ts"],
    minify: options.minify ?? false,
    sourcemap: "external",
    format: options.format,
    target: "browser",
    external: options.external ?? [],
  });

  if (!result.success) {
    console.error(`Build failed for ${options.outputName}:`, result.logs);
    throw new Error(`Build failed for ${options.outputName}`);
  }

  // Write outputs
  for (const output of result.outputs) {
    if (output.path.endsWith(".js")) {
      let text = await output.text();
      
      // For browser/CJS targets, wrap in an IIFE to prevent global scope pollution
      if (options.format === "cjs") {
        text = `(function() {
          var exports = {};
          var module = { exports: exports };
          var global = globalThis;
          
          ${text}
          
          if (!globalThis.HomieLit) {
            globalThis.HomieLit = module.exports.HomieLit || exports.HomieLit || exports;
          }
        })();`;
      }

      await Bun.write(path.join(distDir, options.outputName), text);
      
      const map = output.sourcemap;
      if (map) {
        await Bun.write(path.join(distDir, `${options.outputName}.map`), JSON.stringify(map));
      }
    }
  }
}

console.log("Building bundles...");

try {
  // ESM: dist/homie-lit.esm.js
  await runBuild({
    entrypoint: "./src/index.ts",
    format: "esm",
    external: ["lit", "rxjs", "mqtt"],
    outputName: "homie-lit.esm.js",
  });

  // Core: dist/homie-lit.core.js
  await runBuild({
    entrypoint: "./src/index.ts",
    format: "esm",
    external: ["lit", "rxjs", "mqtt", "loglevel"],
    outputName: "homie-lit.core.js",
  });

  // Main Browser: dist/homie-lit.js (unminified bundle that assigns to window.HomieLit)
  await runBuild({
    entrypoint: "./src/browser-entry.ts",
    format: "cjs",
    outputName: "homie-lit.js",
  });

  // Minified Main Browser: dist/homie-lit.min.js
  await runBuild({
    entrypoint: "./src/browser-entry.ts",
    format: "cjs",
    minify: true,
    outputName: "homie-lit.min.js",
  });

  console.log("Build completed successfully!");
} catch (e) {
  console.error("Build process failed:", e);
  process.exit(1);
}
