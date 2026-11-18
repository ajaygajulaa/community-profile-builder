import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import postcss from "postcss";
import tailwindcss from "tailwindcss";

test("Village Youth Hub heading renders in red", async () => {
  const server = await createServer({ mode: "production", server: { middlewareMode: true }, appType: "custom" });
  try {
    const { default: LoginForm } = await server.ssrLoadModule("/src/components/LoginForm.tsx");
    const html = renderToStaticMarkup(React.createElement(LoginForm, { onLogin: () => {} }));
    const heading = html.match(/<h1 class="([^"]+)">Village Youth Hub<\/h1>/);
    assert.ok(heading, "the login page has the Village Youth Hub heading");
    assert.ok(heading[1].split(" ").includes("text-red-700"));
    assert.match(html, /<p class="text-gray-600">Connect with your community<\/p>/);

    const css = await postcss([tailwindcss("./tailwind.config.ts")])
      .process("@tailwind utilities;", { from: undefined });
    assert.match(css.css, /\.text-red-700\s*\{[^}]*color:\s*rgb\(185\s+28\s+28\s*\/\s*var\(--tw-text-opacity(?:,\s*1)?\)\)/);
  } finally {
    await server.close();
  }
});
