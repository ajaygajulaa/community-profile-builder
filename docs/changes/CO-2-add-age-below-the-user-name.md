# Summary

Show age below the member welcome name

## What changed

- The member home welcome displays the current user's age below their name, before the existing description.
- Missing ages display "Not provided".

## Decisions

- Reused the existing user age and profile wording; no fetch or schema change was needed. Null and undefined are missing, but zero is displayed.

## How each criterion is met

- Age below the user name: `member welcome shows saved age directly below the name` checks rendered ages including zero, their placement, and representative existing controls.
- Missing age: `member welcome shows a fallback for missing age` checks null and undefined in the same position.

## How to verify

Run `npm test`, or start `npm run dev` and sign in as a member to inspect the welcome with a saved or missing age.

## Tests

- Added two server-rendered Home tests for saved, zero, null and undefined ages.
- `npm test`: passed twice, 6 tests each; both runs logged a Vite WebSocket port-in-use warning.
- `node --test src/components/Home.test.mjs`: passed, 2 tests.
- `npx tsc -b --noEmit`: passed.
- `npm run build`: passed; Browserslist data is outdated.
- `npm run lint`: failed on four existing errors in `ui/command.tsx`, `ui/textarea.tsx`, `pages/Index.tsx`, and `tailwind.config.ts`, with ten existing warnings.
- `npx eslint src/components/Home.tsx src/components/Home.test.mjs`: passed with the existing Home hook dependency warning.

## Docs updated

- README describes the welcome age and test coverage. Existing `.gitignore` excludes dependencies, build output and caches.

## Open questions

None.
