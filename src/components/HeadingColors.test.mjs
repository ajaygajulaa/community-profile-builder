import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import postcss from "postcss";
import tailwindcss from "tailwindcss";

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

test("app headings and card titles have no overriding color classes", async () => {
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
    for (const [openingTag] of headings) {
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
