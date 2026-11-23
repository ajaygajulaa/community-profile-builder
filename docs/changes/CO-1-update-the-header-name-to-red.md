# Summary

Make the Home header name red

## What changed

The member Home header displays “Village Youth Hub” in red.

## Decisions

Used the existing `text-red-600` utility on the Home heading only; other headings retain the shared green style.

## How each criterion is met

- Header name is red: `member home header name is red` checks rendered markup, and `generated red utility overrides the base heading color` checks the generated CSS and selector specificity.
- Other headings remain unchanged: `app headings and card titles have no overriding color classes except the home header`, `login heading and card title use the shared style`, and the member navigation test check the other views.

## How to verify

Run `npm test` and `npm run build`. Sign in as a member, check the Home header, then open Profile and return Home.

## Tests

- Added rendered Home header and generated red CSS checks; updated heading exception and Home–Profile navigation checks.
- `npm test`: passed (8 Node tests and 4 Vitest tests); the Node tests logged a Vite WebSocket port-in-use warning. An initial run failed due to an overly strict CSS assertion; corrected and reran successfully.
- `npm run build`: passed; Browserslist reported outdated data.
- `npx tsc --noEmit -p tsconfig.app.json && npx tsc --noEmit -p tsconfig.node.json`: passed.
- `npm run lint`: failed on four pre-existing errors in `ui/command.tsx`, `ui/textarea.tsx`, `pages/Index.tsx`, and `tailwind.config.ts`, plus ten existing warnings.
- No manual visual check was performed; navigation is covered by interaction tests.

## Docs updated

Updated the README test description.

## Open questions

None.
