import { describe, expect, it } from "vitest";
import {
  aiAssistantSchema,
  aiScanSchema,
  createActivitySchema,
  loginSchema,
  refreshSchema,
  registerSchema,
} from "./index";

describe("registerSchema", () => {
  it("accepts a valid registration", () => {
    const parsed = registerSchema.safeParse({
      firstName: "Vanessa",
      lastName: "Uwase",
      email: "Vanessa@Example.com ",
      password: "Password123",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.email).toBe("vanessa@example.com");
    }
  });

  it("rejects short passwords", () => {
    expect(
      registerSchema.safeParse({
        firstName: "A",
        lastName: "B",
        email: "a@b.co",
        password: "short1",
      }).success,
    ).toBe(false);
  });

  it("rejects passwords without numbers", () => {
    expect(
      registerSchema.safeParse({
        firstName: "A",
        lastName: "B",
        email: "a@b.co",
        password: "onlyletters",
      }).success,
    ).toBe(false);
  });

  it("rejects invalid emails", () => {
    expect(
      registerSchema.safeParse({
        firstName: "A",
        lastName: "B",
        email: "not-an-email",
        password: "Password123",
      }).success,
    ).toBe(false);
  });
});

describe("loginSchema", () => {
  it("normalizes the email", () => {
    const parsed = loginSchema.parse({
      email: "  USER@Site.RW ",
      password: "x",
    });
    expect(parsed.email).toBe("user@site.rw");
  });
});

describe("refreshSchema", () => {
  it("requires a substantial token string", () => {
    expect(refreshSchema.safeParse({ refreshToken: "tiny" }).success).toBe(
      false,
    );
    expect(
      refreshSchema.safeParse({ refreshToken: "a".repeat(32) }).success,
    ).toBe(true);
  });
});

describe("aiScanSchema", () => {
  it("accepts a JPEG data URL", () => {
    expect(
      aiScanSchema.safeParse({
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
      }).success,
    ).toBe(true);
  });

  it("rejects non-image data URLs", () => {
    expect(
      aiScanSchema.safeParse({ image: "data:text/html;base64,PGI+" }).success,
    ).toBe(false);
  });

  it("rejects oversized payloads", () => {
    const huge = `data:image/jpeg;base64,${"A".repeat(1_500_000)}`;
    expect(aiScanSchema.safeParse({ image: huge }).success).toBe(false);
  });
});

describe("aiAssistantSchema", () => {
  it("accepts a plain message", () => {
    expect(
      aiAssistantSchema.safeParse({ message: "I have plastic bottles" })
        .success,
    ).toBe(true);
  });

  it("caps history length", () => {
    const history = Array.from({ length: 13 }, (_, i) => ({
      role: "user",
      content: `msg ${i}`,
    }));
    expect(
      aiAssistantSchema.safeParse({ message: "hi", history }).success,
    ).toBe(false);
  });
});

describe("createActivitySchema", () => {
  it("applies defaults for location and artKey", () => {
    const parsed = createActivitySchema.parse({
      type: "Reuse",
      title: "Reused a jar",
      description: "Cleaned and stored spices in it",
    });
    expect(parsed.location).toBe("Home");
    expect(parsed.artKey).toBe("glass-jar");
  });

  it("rejects unknown types", () => {
    expect(
      createActivitySchema.safeParse({
        type: "Burn",
        title: "x",
        description: "y",
      }).success,
    ).toBe(false);
  });
});
