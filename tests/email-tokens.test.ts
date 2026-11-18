import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readToken, signToken } from "@/lib/email/tokens";

describe("signed newsletter links", () => {
  beforeEach(() => {
    vi.stubEnv("NEWSLETTER_SECRET", "test-secret-value");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it("round trips the email and interests", () => {
    const token = signToken("confirm", "owner@example.co.za", 7, ["payroll"]);
    expect(token).toBeTruthy();
    expect(readToken(token!, "confirm")).toEqual({ email: "owner@example.co.za", interests: ["payroll"] });
  });

  it("rejects a token used for the wrong purpose", () => {
    const token = signToken("confirm", "owner@example.co.za", 7)!;
    expect(readToken(token, "unsubscribe")).toBeNull();
  });

  it("rejects a tampered token", () => {
    const token = signToken("unsubscribe", "owner@example.co.za", 7)!;
    const [data, sig] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ p: "unsubscribe", e: "someone@else.com", x: Date.now() + 1e9 })).toString("base64url");
    expect(readToken(`${forged}.${sig}`, "unsubscribe")).toBeNull();
    expect(readToken(`${data}.x${sig.slice(1)}`, "unsubscribe")).toBeNull();
  });

  it("rejects a token signed with another secret", () => {
    const token = signToken("confirm", "owner@example.co.za", 7)!;
    vi.stubEnv("NEWSLETTER_SECRET", "a-different-secret");
    expect(readToken(token, "confirm")).toBeNull();
  });

  it("rejects an expired token", () => {
    vi.useFakeTimers();
    const token = signToken("confirm", "owner@example.co.za", 7)!;
    vi.setSystemTime(Date.now() + 8 * 86_400_000);
    expect(readToken(token, "confirm")).toBeNull();
  });

  it("falls back to a secret derived from the Resend key", () => {
    vi.stubEnv("NEWSLETTER_SECRET", "");
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    const token = signToken("confirm", "owner@example.co.za", 7);
    expect(token).toBeTruthy();
    expect(readToken(token!, "confirm")?.email).toBe("owner@example.co.za");
  });

  it("returns null when no secret is available", () => {
    vi.stubEnv("NEWSLETTER_SECRET", "");
    vi.stubEnv("RESEND_API_KEY", "");
    expect(signToken("confirm", "owner@example.co.za", 7)).toBeNull();
  });
});
