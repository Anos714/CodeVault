"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import type { editor } from "monaco-editor";
import type { Monaco } from "@monaco-editor/react";
import { cn } from "@/lib/utils";

/**
 * Monaco is a browser-only library (it reaches for `self`/workers at import
 * time), so the Editor is loaded with `ssr: false` inside this client
 * component — the App Router pattern from the lazy-loading guide.
 */
const Editor = dynamic(() => import("@monaco-editor/react").then((m) => m.Editor), {
  ssr: false,
  loading: () => <EditorLoading />,
});

/** CodeVault tokens, mirrored from globals.css so the editor matches the site */
function defineCodeVaultTheme(monaco: Monaco) {
  monaco.editor.defineTheme("codevault-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "e6ebf2" },
      { token: "keyword", foreground: "c792ea" },
      { token: "string", foreground: "7ee2a8" },
      { token: "number", foreground: "f0b35c" },
      { token: "comment", foreground: "7c8a9c", fontStyle: "italic" },
      { token: "function", foreground: "82aaff" },
      { token: "type", foreground: "82aaff" },
      { token: "delimiter", foreground: "8fa6bc" },
      { token: "tag", foreground: "c792ea" },
      { token: "attribute.name", foreground: "f0b35c" },
      { token: "attribute.value", foreground: "7ee2a8" },
    ],
    colors: {
      "editor.background": "#00000000",
      "editor.foreground": "#e6ebf2",
      "editorLineNumber.foreground": "#4b5a6b",
      "editorLineNumber.activeForeground": "#8fa6bc",
      "editor.selectionBackground": "#2fbf9b33",
      "editor.inactiveSelectionBackground": "#2fbf9b1f",
      "editorCursor.foreground": "#2fbf9b",
      "editorWhitespace.foreground": "#2b3644",
      "editorIndentGuide.background1": "#233040",
      "editorIndentGuide.activeBackground1": "#33455a",
      "editorWidget.background": "#161e27",
      "editorWidget.border": "#233040",
      "editorSuggestWidget.background": "#161e27",
      "editorSuggestWidget.border": "#233040",
      "editorSuggestWidget.selectedBackground": "#2fbf9b22",
      "editorHoverWidget.background": "#161e27",
      "editorHoverWidget.border": "#233040",
      "editorBracketMatch.background": "#2fbf9b2e",
      "editorBracketMatch.border": "#2fbf9b00",
      "scrollbar.shadow": "#00000000",
      "scrollbarSlider.background": "#8fa6bc2e",
      "scrollbarSlider.hoverBackground": "#8fa6bc4d",
      "scrollbarSlider.activeBackground": "#8fa6bc66",
    },
  });

  monaco.editor.defineTheme("codevault-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "", foreground: "2b3644" },
      { token: "keyword", foreground: "8b3fb5" },
      { token: "string", foreground: "1d7a4f" },
      { token: "number", foreground: "b45309" },
      { token: "comment", foreground: "6b7686", fontStyle: "italic" },
      { token: "function", foreground: "2563eb" },
      { token: "type", foreground: "2563eb" },
      { token: "delimiter", foreground: "5a6878" },
      { token: "tag", foreground: "8b3fb5" },
      { token: "attribute.name", foreground: "b45309" },
      { token: "attribute.value", foreground: "1d7a4f" },
    ],
    colors: {
      "editor.background": "#00000000",
      "editor.foreground": "#2b3644",
      "editorLineNumber.foreground": "#a8b3c2",
      "editorLineNumber.activeForeground": "#5a6878",
      "editor.selectionBackground": "#0f8b6a2b",
      "editor.inactiveSelectionBackground": "#0f8b6a1a",
      "editorCursor.foreground": "#0f8b6a",
      "editorWhitespace.foreground": "#d5dbe3",
      "editorIndentGuide.background1": "#dde3ea",
      "editorIndentGuide.activeBackground1": "#c3cdd9",
      "editorWidget.background": "#ffffff",
      "editorWidget.border": "#dde3ea",
      "editorSuggestWidget.background": "#ffffff",
      "editorSuggestWidget.border": "#dde3ea",
      "editorSuggestWidget.selectedBackground": "#0f8b6a1a",
      "editorHoverWidget.background": "#ffffff",
      "editorHoverWidget.border": "#dde3ea",
      "editorBracketMatch.background": "#0f8b6a26",
      "editorBracketMatch.border": "#0f8b6a00",
      "scrollbar.shadow": "#00000000",
      "scrollbarSlider.background": "#5a68782e",
      "scrollbarSlider.hoverBackground": "#5a68784d",
      "scrollbarSlider.activeBackground": "#5a687866",
    },
  });
}

const editorOptions: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  fontSize: 13,
  lineHeight: 20,
  fontFamily:
    "var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  fontLigatures: true,
  scrollBeyondLastLine: false,
  smoothScrolling: true,
  cursorBlinking: "smooth",
  cursorSmoothCaretAnimation: "on",
  padding: { top: 16, bottom: 16 },
  tabSize: 2,
  automaticLayout: true,
  wordWrap: "on",
  renderLineHighlight: "all",
  lineNumbersMinChars: 3,
  glyphMargin: false,
  roundedSelection: true,
  scrollbar: {
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10,
  },
  fixedOverflowWidgets: true,
};

export type CodeEditorProps = {
  value: string;
  language?: string;
  onChange?: (value: string) => void;
  /** read-only viewer mode (snippet detail page) */
  readOnly?: boolean;
  /**
   * Editor height in px. Monaco's wrapper needs an explicit height — `auto`
   * collapses to zero and renders nothing — so strings other than numbers are
   * ignored and replaced with the default.
   */
  height?: number;
  className?: string;
};

export function CodeEditor({
  value,
  language = "typescript",
  onChange,
  readOnly = false,
  height = 360,
  className,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleBeforeMount = useCallback((monaco: Monaco) => {
    defineCodeVaultTheme(monaco);
  }, []);

  const handleMount = useCallback(
    (editorInstance: editor.IStandaloneCodeEditor) => {
      editorRef.current = editorInstance;
      editorInstance.focus();
    },
    [],
  );

  // re-theme when the app theme flips
  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.updateOptions({
      theme: resolvedTheme === "light" ? "codevault-light" : "codevault-dark",
    });
  }, [resolvedTheme]);

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border", className)}>
      <Editor
        value={value}
        language={language}
        height={height}
        theme={resolvedTheme === "light" ? "codevault-light" : "codevault-dark"}
        beforeMount={handleBeforeMount}
        onMount={handleMount}
        onChange={(newValue) => onChange?.(newValue ?? "")}
        options={readOnly ? { ...editorOptions, readOnly: true } : editorOptions}
        loading={<EditorLoading />}
      />
    </div>
  );
}

function EditorLoading() {
  return (
    <div className="flex h-full min-h-[12rem] flex-col gap-3 bg-background/40 p-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="size-2.5 animate-pulse rounded-full bg-syntax-number/70" />
          <span className="size-2.5 animate-pulse rounded-full bg-primary/70 [animation-delay:120ms]" />
          <span className="size-2.5 animate-pulse rounded-full bg-syntax-function/70 [animation-delay:240ms]" />
        </div>
        <span className="font-mono text-[0.68rem] text-muted-foreground">
          loading editor…
        </span>
      </div>
      <div className="relative h-full overflow-hidden rounded-lg border border-border bg-muted/30">
        <div className="absolute inset-y-0 w-24 -skew-x-12 bg-gradient-to-r from-transparent via-foreground/[0.05] to-transparent animate-shimmer-x" />
      </div>
    </div>
  );
}
