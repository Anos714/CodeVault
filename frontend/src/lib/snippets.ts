import type { Token, CodeLine } from "@/components/site/code-window";

export type DemoLanguage = "javascript" | "typescript" | "python";

export const demoSnippets: Record<
  DemoLanguage,
  { label: string; filename: string; lines: CodeLine[] }
> = {
  javascript: {
    label: "JavaScript",
    filename: "debounce.js",
    lines: [
      [
        { text: "export function ", type: "keyword" },
        { text: "debounce", type: "function" },
        { text: "(", type: "punctuation" },
        { text: "fn", type: "plain" },
        { text: ", ", type: "punctuation" },
        { text: "ms", type: "plain" },
        { text: ") {", type: "punctuation" },
      ],
      [
        { text: "  let ", type: "keyword" },
        { text: "timer", type: "plain" },
        { text: ";", type: "punctuation" },
      ],
      [
        { text: "  return ", type: "keyword" },
        { text: "(...args) =>", type: "plain" },
        { text: " {", type: "punctuation" },
      ],
      [
        { text: "    clearTimeout", type: "function" },
        { text: "(", type: "punctuation" },
        { text: "timer", type: "plain" },
        { text: ");", type: "punctuation" },
      ],
      [
        { text: "    timer = ", type: "plain" },
        { text: "setTimeout", type: "function" },
        { text: "(() => ", type: "plain" },
        { text: "fn", type: "function" },
        { text: "(", type: "punctuation" },
        { text: "...args", type: "plain" },
        { text: "), ", type: "punctuation" },
        { text: "ms", type: "plain" },
        { text: ");", type: "punctuation" },
      ],
      [
        { text: "  };", type: "punctuation" },
      ],
      [
        { text: "}", type: "punctuation" },
      ],
      [
        { text: "// saved to CodeVault — never write this twice", type: "comment" },
      ],
    ],
  },
  typescript: {
    label: "TypeScript",
    filename: "debounce.ts",
    lines: [
      [
        { text: "export function ", type: "keyword" },
        { text: "debounce", type: "function" },
        { text: "<", type: "punctuation" },
        { text: "T extends ", type: "keyword" },
        { text: "...", type: "punctuation" },
        { text: "Args", type: "plain" },
        { text: ">", type: "punctuation" },
      ],
      [
        { text: "  (", type: "punctuation" },
        { text: "fn", type: "plain" },
        { text: ": ", type: "punctuation" },
        { text: "(...args: Args) => void", type: "plain" },
        { text: ", ", type: "punctuation" },
        { text: "ms", type: "plain" },
        { text: ": number", type: "keyword" },
        { text: ") {", type: "punctuation" },
      ],
      [
        { text: "  let ", type: "keyword" },
        { text: "timer", type: "plain" },
        { text: ": ReturnType<typeof setTimeout>;", type: "plain" },
      ],
      [
        { text: "  return ", type: "keyword" },
        { text: "(...args: Args) =>", type: "plain" },
        { text: " {", type: "punctuation" },
      ],
      [
        { text: "    clearTimeout", type: "function" },
        { text: "(", type: "punctuation" },
        { text: "timer", type: "plain" },
        { text: ");", type: "punctuation" },
      ],
      [
        { text: "    timer = ", type: "plain" },
        { text: "setTimeout", type: "function" },
        { text: "(() => ", type: "plain" },
        { text: "fn", type: "function" },
        { text: "(", type: "punctuation" },
        { text: "...args", type: "plain" },
        { text: "), ", type: "punctuation" },
        { text: "ms", type: "plain" },
        { text: ");", type: "punctuation" },
      ],
      [
        { text: "  };", type: "punctuation" },
      ],
      [
        { text: "}", type: "punctuation" },
      ],
      [
        { text: "// typed, tested, vaulted ✅", type: "comment" },
      ],
    ],
  },
  python: {
    label: "Python",
    filename: "debounce.py",
    lines: [
      [
        { text: "import ", type: "keyword" },
        { text: "functools", type: "plain" },
      ],
      [
        { text: "from ", type: "keyword" },
        { text: "typing ", type: "plain" },
        { text: "import ", type: "keyword" },
        { text: "Callable", type: "function" },
      ],
      [
        { text: "def ", type: "keyword" },
        { text: "debounce", type: "function" },
        { text: "(", type: "punctuation" },
        { text: "fn: Callable, ms: float", type: "plain" },
        { text: "):", type: "punctuation" },
      ],
      [
        { text: "    timer = ", type: "plain" },
        { text: "None", type: "keyword" },
      ],
      [
        { text: "    def ", type: "keyword" },
        { text: "debounced", type: "function" },
        { text: "(*args):", type: "punctuation" },
      ],
      [
        { text: "        nonlocal timer", type: "keyword" },
      ],
      [
        { text: "        if timer: timer.cancel()", type: "plain" },
      ],
      [
        { text: "        timer = threading.Timer", type: "plain" },
        { text: "(", type: "punctuation" },
        { text: "ms / 1000, lambda: fn(*args)", type: "string" },
        { text: ")", type: "punctuation" },
      ],
      [
        { text: "        timer.start()", type: "plain" },
      ],
      [
        { text: "    return debounced", type: "keyword" },
      ],
    ],
  },
};

export type { Token, CodeLine };
