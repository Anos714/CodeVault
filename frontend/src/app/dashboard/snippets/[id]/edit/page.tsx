"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Globe, Lock, Sparkles } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { CodeEditor } from "@/components/dashboard/code-editor";
import { Button } from "@/components/ui/button";
import { useSnippetStore } from "@/store/snippet.store";
import { LANGUAGES, LANGUAGE_META } from "@/lib/languages";
import type { Visibility } from "@/lib/snippet-data";
import { cn } from "@/lib/utils";

const MAX_TAGS = 5;

export default function EditSnippetPage({
  params,
}: PageProps<"/dashboard/snippets/[id]/edit">) {
  const { id } = use(params);
  const router = useRouter();

  const snippet = useSnippetStore((state) =>
    state.snippets.find((item) => item.id === id),
  );
  const updateSnippet = useSnippetStore((state) => state.updateSnippet);

  const [title, setTitle] = useState(snippet?.title ?? "");
  const [description, setDescription] = useState(snippet?.description ?? "");
  const [language, setLanguage] = useState(snippet?.language ?? "typescript");
  const [code, setCode] = useState(snippet?.code ?? "");
  const [tags, setTags] = useState<string[]>(snippet?.tags ?? []);
  const [tagDraft, setTagDraft] = useState("");
  const [visibility, setVisibility] = useState<Visibility>(
    snippet?.visibility ?? "private",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  if (!snippet) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Link
          href="/dashboard/snippets"
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to snippets
        </Link>
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/30 px-6 py-20 text-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              Snippet not found
            </h2>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              It may have been deleted.
            </p>
          </div>
          <Button
            className="h-9 rounded-full px-5"
            render={<Link href="/dashboard/snippets" />}
          >
            Browse your vault
          </Button>
        </div>
      </div>
    );
  }

  const addTag = () => {
    const normalized = tagDraft.trim().toLowerCase().replace(/^#/, "");
    if (!normalized || tags.includes(normalized) || tags.length >= MAX_TAGS) {
      setTagDraft("");
      return;
    }
    setTags((prev) => [...prev, normalized]);
    setTagDraft("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Give the snippet a title.";
    if (!code.trim()) next.code = "Paste or write some code.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    updateSnippet(snippet.id, {
      title: title.trim(),
      description: description.trim(),
      language,
      tags,
      code,
      visibility,
    });

    setSaved(true);
    setTimeout(() => router.push(`/dashboard/snippets/${snippet.id}`), 600);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <DashboardHeader
        eyebrow="Edit snippet"
        title="Refine your snippet"
        description="Update the code, retag it, or change who can see it."
      />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_minmax(0,1fr)]"
      >
        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card/40 p-5">
          <Field label="Title" error={errors.title} htmlFor="snippet-title">
            <input
              id="snippet-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={80}
              className={inputClass(Boolean(errors.title))}
            />
          </Field>

          <Field label="Description" htmlFor="snippet-description" optional>
            <textarea
              id="snippet-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={2}
              maxLength={220}
              className={cn(inputClass(false), "resize-none")}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Language" htmlFor="snippet-language">
              <select
                id="snippet-language"
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as typeof language)
                }
                className={inputClass(false)}
              >
                {LANGUAGES.map((value) => (
                  <option key={value} value={value}>
                    {LANGUAGE_META[value].label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Visibility" htmlFor="snippet-visibility">
              <div className="flex h-10 gap-2">
                {(["private", "public"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setVisibility(value)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-lg border text-sm font-medium capitalize transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      visibility === value
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-background/60 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {value === "public" ? (
                      <Globe className="size-3.5" />
                    ) : (
                      <Lock className="size-3.5" />
                    )}
                    {value}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <Field
            label="Tags"
            htmlFor="snippet-tag"
            optional
            hint={`${tags.length}/${MAX_TAGS}`}
          >
            <div className="flex flex-col gap-2">
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                    >
                      #{tag}
                      <span aria-hidden>×</span>
                    </button>
                  ))}
                </div>
              )}
              <input
                id="snippet-tag"
                type="text"
                value={tagDraft}
                onChange={(event) => setTagDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === ",") {
                    event.preventDefault();
                    addTag();
                  }
                }}
                onBlur={addTag}
                placeholder={
                  tags.length >= MAX_TAGS ? "Tag limit reached" : "auth, regex, utils…"
                }
                disabled={tags.length >= MAX_TAGS}
                className={inputClass(false)}
              />
            </div>
          </Field>

          <Field label="Code" error={errors.code} htmlFor="snippet-code">
            <CodeEditor
              value={code}
              language={language}
              onChange={setCode}
              height={340}
              aria-label="Snippet code"
            />
          </Field>

          <div className="flex items-center gap-3 border-t border-border pt-4">
            <Button type="submit" size="lg" className="h-10 gap-2 rounded-xl px-5">
              {saved ? (
                <>
                  <Check className="size-4" />
                  Saved
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Save changes
                </>
              )}
            </Button>
            <span className="font-mono text-xs text-muted-foreground">
              {visibility === "public"
                ? "Anyone with the link can view it"
                : "Only you can see it"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:sticky lg:top-8 lg:self-start">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground/70">
            Live preview
          </span>
          <div className="overflow-hidden rounded-2xl border border-border bg-card/50">
            <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
              <span className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-syntax-number/70" />
                <span className="size-2.5 rounded-full bg-primary/70" />
                <span className="size-2.5 rounded-full bg-syntax-function/70" />
              </span>
              <span className="ml-2 font-mono text-xs text-muted-foreground">
                {title.trim()
                  ? title.trim().toLowerCase().replace(/\s+/g, "-")
                  : "untitled"}
                .{language === "typescript" ? "ts" : language === "javascript" ? "js" : language}
              </span>
              <span
                className={cn(
                  "ml-auto inline-flex items-center gap-1 font-mono text-[0.68rem]",
                  visibility === "public"
                    ? "text-syntax-function"
                    : "text-muted-foreground",
                )}
              >
                {visibility === "public" ? (
                  <Globe className="size-3.5" />
                ) : (
                  <Lock className="size-3.5" />
                )}
                {visibility}
              </span>
            </div>
            <pre className="max-h-80 overflow-auto px-4 py-4 font-mono text-[0.8rem] leading-relaxed">
              <code>
                {code ? (
                  code.split("\n").map((line, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="w-5 shrink-0 select-none text-right text-muted-foreground/40 tabular-nums">
                        {i + 1}
                      </span>
                      <span className="whitespace-pre text-foreground/90">
                        {line || " "}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="select-none text-muted-foreground/50">
                    {"// your code appears here as you type"}
                  </span>
                )}
              </code>
            </pre>
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 border-t border-border px-4 py-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-muted/50 px-2 py-0.5 font-mono text-xs text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground/80"
      >
        {label}
        {optional && (
          <span className="text-[0.6rem] normal-case tracking-normal text-muted-foreground/50">
            optional
          </span>
        )}
        {hint && (
          <span className="ml-auto text-[0.62rem] tabular-nums text-muted-foreground/50">
            {hint}
          </span>
        )}
      </label>
      {children}
      {error && (
        <span className="text-xs text-destructive" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "h-10 w-full rounded-lg border bg-background/60 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
    hasError
      ? "border-destructive/60 focus-visible:border-destructive"
      : "border-input focus-visible:border-ring",
  );
}
