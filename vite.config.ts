import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
// A visible build id, so a stale cached page can be told from a current one.
const buildId =
  process.env.BUILD_ID ||
  new Date().toISOString().slice(0, 16).replace("T", " ") + " local";

export default defineConfig({
  base: process.env.PAGES_BASE_PATH || "./",
  define: { __BUILD_ID__: JSON.stringify(buildId) },
  plugins: [react()],
  worker: { format: "es" },
  // Several suites replay every proof and build every question over many
  // seeds; on a busy machine, running in parallel, that passes 5 seconds.
  test: { testTimeout: 30_000 },
});
