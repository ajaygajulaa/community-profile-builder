import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("authentication screen uses local pink styling", async () => {
  const server = await createServer({ mode: "production", server: { middlewareMode: true }, appType: "custom" });
  try {
    const { default: LoginForm } = await server.ssrLoadModule("/src/components/LoginForm.tsx");
    const html = renderToStaticMarkup(React.createElement(LoginForm, { onLogin: () => {} }));
    assert.match(html, /from-pink-50 via-rose-50 to-pink-100/);
    assert.match(html, /w-16 h-16 bg-pink-700/);
    assert.match(html, /<h1 class="text-3xl font-bold mb-2 text-pink-800">Village Youth Hub<\/h1>/);
    assert.match(html, /<h3 class="[^"]*text-pink-800[^"]*">Welcome<\/h3>/);
    assert.match(html, /<p class="text-gray-600">Connect with your community<\/p>/);
    assert.match(html, /bg-pink-700 text-white hover:bg-pink-800 focus-visible:ring-pink-700/);
  } finally {
    await server.close();
  }
});
