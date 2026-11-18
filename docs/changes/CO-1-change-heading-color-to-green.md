# Summary

Verify existing green headings

## What changed

- Confirmed the existing shared heading style is green; no production color change was needed.
- Added a test that the app entry loads the shared stylesheet, and ignored common build, coverage and cache directories.

## Decisions

- Retained the existing dark green (`#166534`) and heading-specific override behavior. Card titles already render as h3 elements.

## How each criterion is met

- Green headings: `app entry loads the shared heading stylesheet`, `generated CSS gives all heading levels the shared green`, `app headings and card titles have no overriding color classes`, and `login heading and card title use the shared style` cover the stylesheet, app markup and rendered login.

## How to verify

Run `npm test` and `npm run dev`. Inspect headings on login, registration, member tabs, profile, admin and the 404 page.

## Tests

- Added `app entry loads the shared heading stylesheet`.
- `npm test`: passed before the change (3 tests) and after it (4 tests).
- `npm run build`: passed; Browserslist data is outdated.
- `npx tsc -b --noEmit`: passed.
- `npm run lint`: failed with four pre-existing errors in `ui/command.tsx`, `ui/textarea.tsx`, `pages/Index.tsx`, and `tailwind.config.ts`, plus ten warnings.
- `npx eslint src/components/HeadingColors.test.mjs`: passed.
- Browser visual inspection was not performed; no browser executable was found.

## Docs updated

- This change note. README already describes the heading tests; no other documentation changed.

## Open questions

None.
