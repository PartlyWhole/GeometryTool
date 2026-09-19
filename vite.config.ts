import { defineConfig } from "vite";
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
});
