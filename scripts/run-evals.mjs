import { pathToFileURL } from "node:url";
import { build } from "vite";

const outfile = "dist/evals/support-regression-runner.mjs";

await build({
  configFile: false,
  logLevel: "silent",
  build: {
    emptyOutDir: false,
    lib: {
      entry: "src/evals/supportRegression.ts",
      formats: ["es"],
      fileName: () => "support-regression-runner.mjs",
    },
    outDir: "dist/evals",
    rollupOptions: {
      external: ["@tanstack/react-start/server-only"],
    },
  },
});

const { runSupportRegressionEvals, summarizeRegressionResults } = await import(
  pathToFileURL(outfile).href
);

const results = runSupportRegressionEvals();
const summary = summarizeRegressionResults(results);

console.log(`Support regression evals: ${summary.status}`);
console.log(`Passed ${summary.passed}/${summary.total} checks.`);

for (const result of results) {
  console.log(`\n${result.ticketId}: ${result.ticketTitle}`);
  for (const check of result.checks) {
    const marker = check.status === "Pass" ? "PASS" : "FAIL";
    console.log(`  ${marker} ${check.name}: ${check.score}/${check.threshold}`);
  }
}

if (summary.status !== "Pass") {
  process.exitCode = 1;
}
