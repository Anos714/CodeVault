"use client";

import { LayoutTemplate } from "lucide-react";
import { templates, templatesForLanguage, type SnippetTemplate } from "@/lib/templates";
import { LANGUAGE_META, isLanguage } from "@/lib/languages";
import { cn } from "@/lib/utils";

type TemplatePickerProps = {
  language: string;
  onPick: (template: SnippetTemplate) => void;
  className?: string;
};

/**
 * Boilerplate strip above the composer. Filtering follows the selected language
 * first and falls back to the whole library so every template stays reachable.
 */
export function TemplatePicker({
  language,
  onPick,
  className,
}: TemplatePickerProps) {
  const filtered = isLanguage(language) ? templatesForLanguage(language) : [];
  const shown = filtered.length > 0 ? filtered : templates;
  const languageLabel = isLanguage(language) ? LANGUAGE_META[language].label : language;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <span className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground/70">
        <LayoutTemplate className="size-3.5" />
        Start from a template
      </span>
      <div className="flex flex-wrap gap-2">
        {shown.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onPick(template)}
            title={template.blurb}
            className="group inline-flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-1.5 text-sm transition-all hover:border-primary/40 hover:bg-card"
          >
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full bg-current",
                LANGUAGE_META[template.language].color,
              )}
            />
            <span className="font-medium text-foreground">{template.name}</span>
            <span className="hidden font-mono text-[0.68rem] text-muted-foreground sm:inline">
              {template.blurb}
            </span>
          </button>
        ))}
      </div>
      <p className="font-mono text-[0.68rem] text-muted-foreground/60">
        {filtered.length > 0
          ? `${languageLabel} templates — picking one fills the form`
          : "No template for this language yet — showing all"}
      </p>
    </div>
  );
}
