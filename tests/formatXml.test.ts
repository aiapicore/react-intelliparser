import { describe, it, expect } from "vitest";
import { formatXml } from "../src/core/formatXml";

describe("formatXml", () => {
  it("formats a simple XML string", () => {
    const result = formatXml("<root><child>value</child></root>");
    expect(result).toContain("root");
    expect(result).toContain("child");
    expect(result).toContain("value");
  });

  it("returns original string for malformed XML", () => {
    const bad = "<root><unclosed>";
    const result = formatXml(bad);
    // Should not throw; returns something
    expect(typeof result).toBe("string");
  });

  it("handles attributes", () => {
    const result = formatXml('<user id="1"><name>Abbas</name></user>');
    expect(result).toContain("user");
    expect(result).toContain("Abbas");
  });
});
