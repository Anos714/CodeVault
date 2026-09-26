/**
 * Tiny regex highlighter for the public share + embed surfaces, where loading
 * Monaco is overkill. It returns HTML string spans tinted with the same
 * `--syntax-*` tokens the rest of the app uses, so the shared block matches
 * what users see in the editor.
 *
 * Deliberately simple and language-agnostic — good enough for a preview block,
 * and the real thing is Monaco in the dashboard.
 */

const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "if", "else", "for", "while",
  "import", "export", "from", "default", "class", "extends", "new", "try",
  "catch", "finally", "throw", "async", "await", "yield", "typeof", "instanceof",
  "in", "of", "this", "super", "void", "delete", "switch", "case", "break",
  "continue", "do", "interface", "type", "enum", "implements", "public",
  "private", "protected", "readonly", "static", "as", "namespace", "declare",
  "module", "abstract", "get", "set", "satisfies", "def", "elif", "lambda",
  "pass", "with", "raise", "class", "is", "not", "and", "or", "None", "True",
  "False", "self", "package", "func", "go", "range", "map", "chan", "select",
]);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type Token = { text: string; type: "plain" | string };

/**
 * Split a line into highlightable tokens. Comments and strings are matched
 * first so keywords inside them stay uncolored.
 */
function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let rest = line;

  const patterns: { type: string; re: RegExp }[] = [
    // line comments: // ... and # ... (python/shell)
    { type: "comment", re: /^(\/\/[^\n]*|#[^\n]*)/ },
    // block-comment fragment continuation (heuristic, handled by caller flag)
    { type: "string", re: /^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/ },
    { type: "number", re: /^\b\d[\d_.eExXa-fA-F]*\b/ },
    { type: "function", re: /^[A-Za-z_$][\w$]*(?=\s*\()/ },
    { type: "plain", re: /^[A-Za-z_$][\w$]*/ },
    { type: "punctuation", re: /^[{}()[\];:,.<>=+\-*/%&|!?^~@]/ },
    { type: "plain", re: /^\s+/ },
    { type: "plain", re: /^./ },
  ];

  while (rest.length > 0) {
    let matched = false;
    for (const { type, re } of patterns) {
      const match = re.exec(rest);
      if (!match) continue;
      const text = match[0];
      tokens.push({ text, type });
      rest = rest.slice(text.length);
      matched = true;
      break;
    }
    if (!matched) break;
  }

  return tokens;
}

const TOKEN_CLASS: Record<string, string> = {
  keyword: "text-syntax-keyword",
  string: "text-syntax-string",
  comment: "text-syntax-comment",
  number: "text-syntax-number",
  function: "text-syntax-function",
  punctuation: "text-syntax-punctuation",
  plain: "text-foreground",
};

export function highlightToHtml(code: string): string {
  const lines = code.split("\n");
  let inBlockComment = false;

  return lines
    .map((line) => {
      if (inBlockComment) {
        const end = line.indexOf("*/");
        if (end === -1) {
          return `<span class="${TOKEN_CLASS.comment}">${escapeHtml(line)}</span>`;
        }
        inBlockComment = false;
        const commentPart = line.slice(0, end + 2);
        const rest = line.slice(end + 2);
        return (
          `<span class="${TOKEN_CLASS.comment}">${escapeHtml(commentPart)}</span>` +
          tokenizeToSpans(rest)
        );
      }

      const blockStart = line.indexOf("/*");
      if (blockStart !== -1 && line.indexOf("*/", blockStart) === -1) {
        inBlockComment = true;
        const before = line.slice(0, blockStart);
        const commentPart = line.slice(blockStart);
        return (
          tokenizeToSpans(before) +
          `<span class="${TOKEN_CLASS.comment}">${escapeHtml(commentPart)}</span>`
        );
      }

      return tokenizeToSpans(line);
    })
    .join("\n");
}

function tokenizeToSpans(line: string): string {
  // fast path for blank lines keeps the pre layout honest
  if (line === "") return " ";

  return tokenizeLine(line)
    .map((token) => {
      const cls =
        token.type === "plain"
          ? TOKEN_CLASS.plain
          : KEYWORDS.has(token.text)
            ? TOKEN_CLASS.keyword
            : TOKEN_CLASS[token.type] ?? TOKEN_CLASS.plain;
      return `<span class="${cls}">${escapeHtml(token.text)}</span>`;
    })
    .join("");
}

export function highlightToNodes(code: string): React.ReactNode[] {
  // kept for potential client-side rendering needs
  return [highlightToHtml(code)];
}
