import { expect, it, vi } from "vitest";

it("keeps demo changes in memory, validates them and resets on reload", async () => {
  vi.resetModules();
  const store = await import("./database");
  const member = { name: " Test ", email: " TEST@example.com ", role: "member" as const, join_date: "2024-01-01" };
  await expect(store.createUser({ ...member, name: " " })).rejects.toThrow("name and valid email");
  await expect(store.createUser({ ...member, email: "bad" })).rejects.toThrow("name and valid email");
  const created = await store.createUser(member);
  expect(created.email).toBe("test@example.com");
  await expect(store.createUser(member)).rejects.toThrow("already registered");
  expect((await store.getUserByEmail("TEST@example.com"))?.id).toBe(created.id);
  created.name = "Changed";
  expect((await store.getUserByEmail(member.email))?.name).toBe("Test");
  await expect(store.updateFinancialData("ganesh_chanda", { current_amount: -1 })).rejects.toThrow();
  await store.updateFinancialData("ganesh_chanda", { current_amount: 0 });
  expect((await store.getFinancialData())[0].current_amount).toBe(0);
  await expect(store.uploadMediaFile(new File(["x"], "bad.txt", { type: "text/plain" }))).rejects.toThrow();
  await store.uploadMediaFile(new File(["x"], "video.mp4", { type: "video/mp4" }));
  expect((await store.getMediaFiles())[0].file_type).toBe("video");
  await expect(store.deleteUser("1")).rejects.toThrow();
  await store.deleteUser(created.id);
  await expect(store.deleteUser(created.id)).rejects.toThrow();
  vi.resetModules();
  const fresh = await import("./database");
  expect(await fresh.getUserByEmail(member.email)).toBeNull();
  expect((await fresh.getFinancialData())[0].current_amount).toBe(25500);
  expect(await fresh.getMediaFiles()).toEqual([]);
});
