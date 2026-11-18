# Summary

Make app headings green

## What changed

- Added a shared green color for h1–h6, including card titles, and removed conflicting heading colors from app screens.
- Preserved existing colors on non-heading text, icons and controls.

## Decisions

- Used Tailwind green-800 (`#166534`), a dark green suitable for the app's light backgrounds. Heading-specific utilities can still override the base style when explicitly needed.

## How each criterion is met

- Headings are green: `generated CSS gives all heading levels the shared green` checks the built CSS; `app headings and card titles have no overriding color classes` checks screen markup, including conditional member names and tab content; `login heading and card title use the shared style` checks rendered login markup.
- Unrelated text and controls retain their colors: the latter two tests check representative text, icons and button classes.

## How to verify

Run `npm test` and `npm run dev`. Inspect login and register, home tabs, profile, admin and the 404 page for green headings.

## Tests

- `npm test`: passed (3 tests, including the new shared-style and screen-markup tests and updated login test).
- `npm run build`: passed; Browserslist data is outdated.
- `npx tsc -b --noEmit`: passed.
- `npm run lint`: failed on four pre-existing errors in `ui/command.tsx`, `ui/textarea.tsx`, `pages/Index.tsx` and `tailwind.config.ts`; ten pre-existing warnings.
- Targeted ESLint on changed components and tests: passed with three pre-existing hook-dependency warnings.
- Browser visual checks were not run (no browser available).

## Docs updated

- README test description updated.
- Existing `.gitignore` already excludes dependencies, build output and TypeScript caches.

## Open questions

None.
