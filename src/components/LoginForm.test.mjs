import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("login heading and card title use the shared style", async () => {
  const server = await createServer({ mode: "production", server: { middlewareMode: true }, appType: "custom" });
  try {
    const { default: LoginForm } = await server.ssrLoadModule("/src/components/LoginForm.tsx");
    const html = renderToStaticMarkup(React.createElement(LoginForm, { onLogin: () => {} }));
    assert.match(html, /<h1 class="text-3xl font-bold mb-2">Village Youth Hub<\/h1>/);
    assert.match(html, /<h3 class="[^"]*">Welcome<\/h3>/);
    assert.match(html, /<p class="text-gray-600">Connect with your community<\/p>/);
    assert.match(html, /class="[^"]*bg-green-600 hover:bg-green-700[^"]*"/);
  } finally {
    await server.close();
  }
});
