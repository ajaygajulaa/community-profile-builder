# Summary

Show age in red below the member welcome name

## What changed

- The member home welcome displays the current user's age in red below their name, before the existing description.
- Missing ages display "Not provided" in the same red style.

## Decisions

- Reused the existing user age and profile wording; no fetch or schema change was needed. Null and undefined are missing, but zero is displayed.
- Used the existing Tailwind `text-red-600` color for the whole age line, including the fallback.

## How each criterion is met

- Red age below the user name: `member welcome shows saved age in red directly below the name` checks rendered ages including zero, their red class, placement, and representative existing controls.
- Missing age: `member welcome shows a red fallback for missing age` checks null and undefined in the same position with the red class.

## How to verify

Run `npm test`, or start `npm run dev` and sign in as a member to inspect the red age line below the welcome name with a saved or missing age.

## Tests

- Added two server-rendered Home tests for saved, zero, null and undefined ages; updated both to assert the red class.
- `npm test`: passed, 6 tests; a Vite WebSocket port-in-use warning was logged. Earlier runs also passed.
- `node --test src/components/Home.test.mjs`: passed, 2 tests in the earlier attempt.
- `npx tsc -b --noEmit`: passed.
- `npm run build`: passed; Browserslist data is outdated.
- `npm run lint`: failed on four existing errors in `ui/command.tsx`, `ui/textarea.tsx`, `pages/Index.tsx`, and `tailwind.config.ts`, with ten existing warnings.
- `npx eslint src/components/Home.tsx src/components/Home.test.mjs`: passed with the existing Home hook dependency warning.

## Docs updated

- README describes the red welcome age and test coverage. Existing `.gitignore` excludes dependencies, build output and caches.

## Open questions

None.
