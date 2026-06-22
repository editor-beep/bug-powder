// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Deploy to Vercel via Nitro's `vercel` preset.
//
// IMPORTANT: do NOT add a custom `nitro.serverEntry`. Pointing Nitro at a
// hand-written handler triggers a second server bundling pass that re-resolves
// TanStack Start's client manifest *without* the captured client build. That
// pass emits an empty manifest whose `clientEntry` is the dev-only virtual path
// `/@id/virtual:tanstack-start-client-entry`. In production that path 404s, the
// app never hydrates, and every button/link becomes inert. Let TanStack Start
// own the server build; route our SSR error wrapper through `server.entry`
// instead (src/server.ts), which is part of the same coherent build.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
  },
});
