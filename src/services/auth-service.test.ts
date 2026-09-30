import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { login, logout, register, hasSession } from "./auth-service";

/**
 * Minimal localStorage stub — the vitest environment is "node" (pure-logic
 * tests per project decision), so we fake just what api-client touches.
 */
const store = new Map<string, string>();
const localStorageStub: Storage = {
  getItem: (key) => store.get(key) ?? null,
  setItem: (key, value) => void store.set(key, value),
  removeItem: (key) => void store.delete(key),
  clear: () => store.clear(),
  key: (index) => [...store.keys()][index] ?? null,
  get length() {
    return store.size;
  },
};

vi.stubGlobal("localStorage", localStorageStub);

const session = {
  user: {
    id: "user-1",
    email: "demo@waste2value.rw",
    firstName: "Vanessa",
    lastName: "Uwase",
    locale: "en",
  },
  accessToken: "access-token-1",
  refreshToken: "refresh-token-1",
  expiresIn: 900,
};

describe("auth-service", () => {
  beforeEach(() => {
    // unstubAllGlobals() in afterEach clears this too, so re-stub per test.
    vi.stubGlobal("localStorage", localStorageStub);
    store.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    store.clear();
  });

  it("login stores the session and resolves it", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify(session), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      ),
    );

    const result = await login({
      email: "demo@waste2value.rw",
      password: "Password123!",
    });
    expect(result.accessToken).toBe("access-token-1");
    expect(hasSession()).toBe(true);
    expect(store.get("w2v.access-token")).toBe("access-token-1");
    expect(store.get("w2v.refresh-token")).toBe("refresh-token-1");
  });

  it("register stores the session", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify(session), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      ),
    );

    const result = await register({
      firstName: "Vanessa",
      lastName: "Uwase",
      email: "new@waste2value.rw",
      password: "Password123",
    });
    expect(result.user.email).toBe("demo@waste2value.rw");
    expect(hasSession()).toBe(true);
  });

  it("surfaces the server error message on bad credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              error: {
                code: "UNAUTHORIZED",
                message: "Invalid email or password.",
              },
            }),
            { status: 401, headers: { "Content-Type": "application/json" } },
          ),
        ),
      ),
    );

    await expect(
      login({ email: "demo@waste2value.rw", password: "wrong" }),
    ).rejects.toThrow("Invalid email or password.");
    expect(hasSession()).toBe(false);
  });

  it("logout clears the stored session even if the server call fails", async () => {
    store.set("w2v.access-token", "tok");
    store.set("w2v.refresh-token", "ref");
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new TypeError("Failed to fetch"))),
    );

    await logout();
    expect(hasSession()).toBe(false);
    expect(store.get("w2v.access-token")).toBeUndefined(); // removed
  });
});
