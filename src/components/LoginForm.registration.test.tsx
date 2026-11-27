import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";
import { createUser, getUserByEmail } from "@/services/database";

vi.mock("@/services/database", () => ({ createUser: vi.fn(), getUserByEmail: vi.fn() }));
const { toast } = vi.hoisted(() => ({ toast: vi.fn() }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast }) }));

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

async function openRegistration() {
  const user = userEvent.setup();
  await user.click(screen.getByRole("tab", { name: "Register" }));
  return user;
}

describe("authentication styling and login", () => {
  it("styles both tabs and their actions in pink with visible focus and hover states", async () => {
    render(<LoginForm onLogin={vi.fn()} />);
    const user = userEvent.setup();
    const login = screen.getByRole("tab", { name: "Login" });
    const register = screen.getByRole("tab", { name: "Register" });
    expect(login.parentElement?.className).toContain("bg-pink-100");
    for (const tab of [login, register]) {
      for (const color of ["text-pink-900", "hover:bg-pink-200", "focus-visible:ring-pink-700", "data-[state=active]:bg-pink-700", "data-[state=active]:text-white", "data-[state=active]:hover:bg-pink-800"]) {
        expect(tab.className).toContain(color);
      }
    }
    expect(login.getAttribute("data-state")).toBe("active");
    const checkAction = (button: HTMLElement) => {
      for (const color of ["bg-pink-700", "text-white", "hover:bg-pink-800", "focus-visible:ring-pink-700"]) expect(button.className).toContain(color);
    };
    checkAction(screen.getByRole("button", { name: "Sign In" }));
    await user.click(register);
    expect(register.getAttribute("data-state")).toBe("active");
    expect(login.getAttribute("data-state")).toBe("inactive");
    checkAction(screen.getByRole("button", { name: "Join Community" }));
    await user.click(login);
    expect(login.getAttribute("data-state")).toBe("active");
  });

  it("still signs in a member", async () => {
    const member = { id: "1", name: "Asha", email: "asha@example.com", role: "member" as const, join_date: "2024-01-01" };
    vi.mocked(getUserByEmail).mockResolvedValue(member);
    const onLogin = vi.fn();
    render(<LoginForm onLogin={onLogin} />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), member.email);
    await user.type(screen.getByLabelText("Password"), "password");
    await user.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() => expect(onLogin).toHaveBeenCalledWith(member));
    expect(getUserByEmail).toHaveBeenCalledWith(member.email);
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Welcome back!" }));
  });

  it("still reports a failed login", async () => {
    vi.mocked(getUserByEmail).mockResolvedValue(null);
    const onLogin = vi.fn();
    render(<LoginForm onLogin={onLogin} />);
    await userEvent.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() => expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Login failed", variant: "destructive" })));
    expect(onLogin).not.toHaveBeenCalled();
  });
});

describe("registration", () => {
  it("shows the remaining fields without age and gives name the full row", async () => {
    render(<LoginForm onLogin={vi.fn()} />);
    await openRegistration();

    expect(screen.queryByLabelText(/age/i)).toBeNull();
    for (const label of ["Full Name", "Email", "Phone", "Occupation", "Interests (comma separated)", "Password"]) {
      expect(screen.getByLabelText(label)).toBeTruthy();
    }
    const name = screen.getByLabelText("Full Name");
    expect(name.className).toContain("w-full");
    expect(name.parentElement?.parentElement?.className).not.toContain("grid-cols-2");
  });

  it("submits the other registration values without age and signs in", async () => {
    const member = { id: "1", name: "Asha", email: "asha@example.com", role: "member" as const, join_date: "2024-01-01" };
    vi.mocked(createUser).mockResolvedValue(member);
    const onLogin = vi.fn();
    render(<LoginForm onLogin={onLogin} />);
    const user = await openRegistration();
    await user.type(screen.getByLabelText("Full Name"), "Asha");
    await user.type(screen.getByLabelText("Email"), "asha@example.com");
    await user.type(screen.getByLabelText("Phone"), "12345");
    await user.type(screen.getByLabelText("Occupation"), "Teacher");
    await user.type(screen.getByLabelText("Interests (comma separated)"), "Sports, Education, , Technology");
    await user.type(screen.getByLabelText("Password"), "password");
    await user.click(screen.getByRole("button", { name: "Join Community" }));

    await waitFor(() => expect(onLogin).toHaveBeenCalledWith(member));
    expect(createUser).toHaveBeenCalledTimes(1);
    expect(createUser).toHaveBeenCalledWith({
      name: "Asha", email: "asha@example.com", phone: "12345", occupation: "Teacher",
      interests: ["Sports", "Education", "Technology"], role: "member",
      join_date: new Date().toISOString().split("T")[0],
    });
    expect(vi.mocked(createUser).mock.calls[0][0]).not.toHaveProperty("age");
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Registration successful!" }));
  });

  it("reports registration failures without signing in", async () => {
    vi.mocked(createUser).mockRejectedValue(new Error("database unavailable"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const onLogin = vi.fn();
    render(<LoginForm onLogin={onLogin} />);
    const user = await openRegistration();
    await user.click(screen.getByRole("button", { name: "Join Community" }));

    await waitFor(() => expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      title: "Registration failed", variant: "destructive",
    })));
    expect(onLogin).not.toHaveBeenCalled();
    expect((screen.getByRole("button", { name: "Join Community" }) as HTMLButtonElement).disabled).toBe(false);
  });
});
