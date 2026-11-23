import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import postcss from "postcss";
import tailwindcss from "tailwindcss";

test("app entry loads the shared heading stylesheet", async () => {
  const entry = await readFile("src/main.tsx", "utf8");
  assert.match(entry, /import\s+["']\.\/index\.css["']/);
});

test("generated CSS gives all heading levels the shared green", async () => {
  const source = await readFile("src/index.css", "utf8");
  const result = await postcss([tailwindcss("./tailwind.config.ts")]).process(source, { from: "src/index.css" });
  const root = postcss.parse(result.css);
  let headingRule;
  root.walkRules((rule) => {
    if (rule.selectors.join(",") === "h1,h2,h3,h4,h5,h6" && rule.nodes.some((node) => node.prop === "color")) {
      headingRule = rule;
    }
  });
  assert.ok(headingRule, "generated CSS contains the heading color rule");
  assert.equal(headingRule.nodes.find((node) => node.prop === "color").value, "#166534");
});

test("generated red utility overrides the base heading color", async () => {
  const source = await readFile("src/index.css", "utf8");
  const result = await postcss([tailwindcss("./tailwind.config.ts")]).process(source, { from: "src/index.css" });
  const root = postcss.parse(result.css);
  let redRule;
  root.walkRules(".text-red-600", (rule) => { redRule = rule; });
  assert.ok(redRule, "generated CSS contains the red utility");
  assert.match(redRule.nodes.find((node) => node.prop === "color").value, /rgb\(220\s+38\s+38\s*\/\s*var\(--tw-text-opacity(?:,\s*1)?\)\)/);
  // A class selector has higher specificity than the base h1 selector.
  assert.equal(redRule.selector, ".text-red-600");
});

test("app headings and card titles have no overriding color classes except the home header", async () => {
  for (const [file, minimum] of [
    ["src/components/LoginForm.tsx", 2],
    ["src/components/Home.tsx", 10],
    ["src/components/AdminDashboard.tsx", 10],
    ["src/components/UserProfile.tsx", 3],
    ["src/pages/NotFound.tsx", 1],
  ]) {
    const source = await readFile(file, "utf8");
    const headings = [...source.matchAll(/<(?:h[1-6]|CardTitle)\b[^>]*>/g)];
    assert.ok(headings.length >= minimum, `${file} headings were checked`);
    if (file === "src/components/Home.tsx") {
      assert.equal(headings.filter(([tag]) => tag === '<h1 className="text-xl font-bold text-red-600">').length, 1);
    }
    for (const [openingTag] of headings) {
      if (file === "src/components/Home.tsx" && openingTag === '<h1 className="text-xl font-bold text-red-600">') continue;
      assert.doesNotMatch(openingTag, /(?:^|[\s"'])text-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|pink|rose|gray|slate|zinc|neutral|stone|white|black|foreground|muted|primary|secondary|accent|destructive)(?:[-\s"']|$)/, `${file}: ${openingTag}`);
      assert.doesNotMatch(openingTag, /\bstyle=/, `${file}: ${openingTag}`);
    }
  }
  const card = await readFile("src/components/ui/card.tsx", "utf8");
  assert.match(card, /<h3\s+ref=\{ref\}/);
  const home = await readFile("src/components/Home.tsx", "utf8");
  assert.match(home, /<Coins className="w-6 h-6 mr-2 text-orange-600"/);
  assert.match(home, /<p className="text-2xl font-bold text-pink-600">/);
  const profile = await readFile("src/components/UserProfile.tsx", "utf8");
  assert.match(profile, /<p className="text-gray-900">\{currentUser.email\}/);
});
