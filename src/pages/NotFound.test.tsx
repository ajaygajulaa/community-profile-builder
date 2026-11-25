import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import App from "@/App";
vi.mock("@/components/ui/sonner", () => ({ Toaster: () => null }));
afterEach(() => { cleanup(); window.history.replaceState({}, "", "/"); });
it("shows a return link for an unknown route", () => {
  window.history.replaceState({}, "", "/unknown");
  render(<App />);
  expect(screen.getByRole("heading", { name: "404" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Return to Home" }).getAttribute("href")).toBe("/");
});
