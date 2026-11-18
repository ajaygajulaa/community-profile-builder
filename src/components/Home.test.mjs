import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("member welcome shows saved age directly below the name", async () => {
  const server = await createServer({ mode: "production", server: { middlewareMode: true, hmr: false }, appType: "custom" });
  try {
    const { default: Home } = await server.ssrLoadModule("/src/components/Home.tsx");
    for (const age of [25, 0]) {
      const html = renderToStaticMarkup(React.createElement(Home, {
        currentUser: { name: "Asha", age }, onLogout: () => {}, onProfileClick: () => {},
      }));
      assert.ok(html.includes(`<h2 class="text-3xl font-bold mb-2">Welcome, Asha!</h2><p class="text-gray-600">Age: ${age} years old</p><p class="text-gray-600">Manage community activities and stay connected</p>`));
      assert.match(html, />Profile<\/button>/);
      assert.match(html, />Logout<\/button>/);
      assert.match(html, />Ganesh Chanda<\/button>/);
    }
  } finally {
    await server.close();
  }
});

test("member welcome shows a fallback for missing age", async () => {
  const server = await createServer({ mode: "production", server: { middlewareMode: true, hmr: false }, appType: "custom" });
  try {
    const { default: Home } = await server.ssrLoadModule("/src/components/Home.tsx");
    for (const age of [null, undefined]) {
      const html = renderToStaticMarkup(React.createElement(Home, {
        currentUser: { name: "Asha", age }, onLogout: () => {}, onProfileClick: () => {},
      }));
      assert.ok(html.includes('<h2 class="text-3xl font-bold mb-2">Welcome, Asha!</h2><p class="text-gray-600">Age: Not provided</p><p class="text-gray-600">Manage community activities and stay connected</p>'));
    }
  } finally {
    await server.close();
  }
});
