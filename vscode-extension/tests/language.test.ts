import { describe, expect, it } from "vitest";

import { toCodeVaultLanguage } from "../src/language";

describe("VS Code language mapping", () => {
  it("maps the common language ids", () => {
    expect(toCodeVaultLanguage("typescript")).toBe("typescript");
    expect(toCodeVaultLanguage("typescriptreact")).toBe("tsx");
    expect(toCodeVaultLanguage("javascriptreact")).toBe("jsx");
    expect(toCodeVaultLanguage("python")).toBe("python");
    expect(toCodeVaultLanguage("shellscript")).toBe("shell");
    expect(toCodeVaultLanguage("cpp")).toBe("cpp");
    expect(toCodeVaultLanguage("c")).toBe("cpp");
    expect(toCodeVaultLanguage("jsonc")).toBe("json");
    expect(toCodeVaultLanguage("yml")).toBe("yaml");
  });

  it("falls back to typescript for unknown ids", () => {
    expect(toCodeVaultLanguage("plaintext")).toBe("typescript");
    expect(toCodeVaultLanguage("")).toBe("typescript");
  });
});
