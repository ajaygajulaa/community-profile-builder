# Summary

Make the app a standalone static demo

# What changed

- Replaced remote database and storage operations with an in-memory store seeded from existing mock data. Removed the Supabase client, configuration, dependency and stale Bun lockfile; npm remains the documented package manager. Removed the external runtime script.
- Validated registration, duplicates and fund inputs; clarified demo password handling, disabled inactive controls, showed gallery empty states and made Home data loads independent with retry. Profile handles absent age and member count. Admin actions report failures, retain saved totals and reset the file picker.
- Gallery actions add filenames only, not file contents. Demo changes are shared within the page session and reset on reload. Removed console errors for expected unknown routes.

# Decisions

The human requested removal of all database connections in favor of a static flow, superseding the prior backend verification plan. No authentication, durable storage, actual file upload or production data access is provided. Existing demo credentials and member navigation remain; never use this as a secure application. Fund and gallery placeholder actions remain disabled.

# How each criterion is met

- Registration and demo sign-in, invalid credentials, member tabs, profile, logout, admin fund edit, member removal and gallery flow: `runs the local registration, member and admin flows without a backend`. Existing `member navigation` tests cover repeat navigation and subsequent sessions.
- Required registration inputs, no age, service errors and duplicate email: `registration` tests; `keeps demo changes in memory, validates them and resets on reload` tests duplicate, invalid, zero, deletion, file type and reload behavior.
- Home independent loading, retry, empty gallery and zero target: `shows independent gallery data on fund failure and retries with zero values`; existing Home tests cover age zero and missing age.
- Admin validation and failure feedback: `reports failed admin actions without claiming success or removing members`.
- Unknown routes: `shows a return link for an unknown route`.

# How to verify

Run `npm ci`, `npm test`, `npm run build`, `npx tsc -p tsconfig.app.json --noEmit`, and `npm run lint`. Start `npm run dev`, use the demo credentials shown on the login screen, navigate Home/Profile, and try the admin actions. Reload to reset the demo. No backend configuration is needed.

# Tests

- `npm test`: passed, 6 node tests and 14 Vitest tests. The pre-existing node tests can emit a Vite WebSocket port-in-use warning. Added static flow, store, Home retry, admin failure and unknown-route tests; updated the existing registration failure test to provide valid inputs so it still exercises the service failure, and added validation and duplicate tests.
- `npm run build` and both app and node TypeScript checks: passed. Build reports outdated Browserslist data.
- `npm run lint`: fails on pre-existing errors in `src/components/ui/command.tsx`, `src/components/ui/textarea.tsx` and `tailwind.config.ts`, with 10 existing warnings. The prior `Index.tsx` any error was fixed.
- Vite HTTP smoke: `/` and `/unknown` return the SPA shell. Full interaction was tested in jsdom, not a real browser; no live backend was contacted.
- `npm uninstall` reported 30 dependency audit vulnerabilities; no unrelated dependency upgrades were applied.

# Docs updated

`README.md` documents the demo, credentials, limitations and verification commands. This change note replaces the earlier navigation-only report.

# Open questions

None. Static demo data and file names are intentionally ephemeral; real authentication and persistence would require a separate design.
