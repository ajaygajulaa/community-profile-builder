import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Index from "./Index";
import { getUserByEmail, getUsers, getFinancialData, getMediaFiles } from "@/services/database";

vi.mock("@/services/database", () => ({
  getUserByEmail: vi.fn(),
  getUsers: vi.fn(),
  getFinancialData: vi.fn(),
  getMediaFiles: vi.fn(),
}));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: vi.fn() }) }));

const member = { id: "1", name: "Asha", email: "asha@example.com", role: "member" as const, join_date: "2024-01-01", age: 25 };
const otherMember = { ...member, id: "2", name: "Ravi", email: "ravi@example.com" };
const admin = { ...member, id: "3", name: "Admin", email: "admin@gmail.com", role: "admin" as const };

beforeEach(() => {
  vi.mocked(getUserByEmail).mockImplementation(async (email) => [member, otherMember, admin].find(user => user.email === email) ?? null);
  vi.mocked(getUsers).mockResolvedValue([member, otherMember, admin]);
  vi.mocked(getFinancialData).mockResolvedValue([]);
  vi.mocked(getMediaFiles).mockResolvedValue([]);
});

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

async function signIn(user: ReturnType<typeof userEvent.setup>, email: string, password = "password") {
  await user.type(screen.getByLabelText("Email"), email);
  await user.type(screen.getByLabelText("Password"), password);
  await user.click(screen.getByRole("button", { name: "Sign In" }));
}

describe("member navigation", () => {
  it("opens the signed-in member profile and returns home repeatedly", async () => {
    const user = userEvent.setup();
    render(<Index />);
    await signIn(user, member.email);
    expect(await screen.findByText("Welcome, Asha!")).toBeTruthy();

    for (let i = 0; i < 2; i++) {
      await user.click(screen.getByRole("button", { name: "Profile" }));
      expect(screen.getByText("Asha")).toBeTruthy();
      expect(screen.getByText(member.email)).toBeTruthy();
      expect(screen.queryByText("Welcome, Asha!")).toBeNull();
      await user.click(screen.getByRole("button", { name: "Back to Home" }));
      expect(screen.getByText("Welcome, Asha!")).toBeTruthy();
      expect(screen.queryByText(member.email)).toBeNull();
    }
  });

  it.each(["home", "profile"])("logs out from %s and starts the next session at home", async (view) => {
    const user = userEvent.setup();
    render(<Index />);
    await signIn(user, member.email);
    await screen.findByText("Welcome, Asha!");
    if (view === "profile") await user.click(screen.getByRole("button", { name: "Profile" }));
    await user.click(screen.getByRole("button", { name: "Logout" }));
    expect(screen.getByRole("button", { name: "Sign In" })).toBeTruthy();
    await signIn(user, otherMember.email);
    expect(await screen.findByText("Welcome, Ravi!")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Profile" }));
    expect(screen.getByText(otherMember.email)).toBeTruthy();
    expect(screen.queryByText(member.email)).toBeNull();
  });

  it("keeps the admin dashboard separate from member navigation", async () => {
    const user = userEvent.setup();
    render(<Index />);
    await signIn(user, admin.email, "admin@123");
    expect(await screen.findByRole("heading", { name: "Admin Dashboard" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Profile" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Logout" }));
    expect(screen.getByRole("button", { name: "Sign In" })).toBeTruthy();
  });
});
