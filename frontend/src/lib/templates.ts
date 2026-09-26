import type { Language } from "@/lib/languages";

export type SnippetTemplate = {
  id: string;
  /** chip label shown in the template picker */
  name: string;
  /** short blurb under the chip */
  blurb: string;
  language: Language;
  title: string;
  description: string;
  tags: string[];
  code: string;
};

/**
 * Boilerplate that pre-seeds the composer. Picking one fills title, language,
 * tags, and the editor body so a snippet starts half-written instead of blank.
 */
export const templates: SnippetTemplate[] = [
  {
    id: "tpl-react-component",
    name: "React component",
    blurb: "Typed component with props + memo",
    language: "tsx",
    title: "Reusable React component",
    description: "A small, typed, memoised component skeleton.",
    tags: ["react", "component"],
    code: `import { memo } from "react";

type ExampleProps = {
  title: string;
  value?: number;
};

export const Example = memo(function Example({
  title,
  value = 0,
}: ExampleProps) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">Value: {value}</p>
    </section>
  );
});`,
  },
  {
    id: "tpl-express-route",
    name: "Express route",
    blurb: "Router + async handler + error pass-through",
    language: "typescript",
    title: "Express resource route",
    description: "A CRUD-shaped express router with async error handling.",
    tags: ["express", "api", "node"],
    code: `import { Router } from "express";
import type { Request, Response, NextFunction } from "express";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = []; // listEntities();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const created = {}; // createEntity(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

export { router };`,
  },
  {
    id: "tpl-sql-migration",
    name: "SQL migration",
    blurb: "Idempotent table with constraints",
    language: "sql",
    title: "Add a table migration",
    description: "Idempotent create-table with sensible constraints and an index.",
    tags: ["sql", "migration", "postgres"],
    code: `CREATE TABLE IF NOT EXISTS snippets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  language    TEXT NOT NULL,
  author_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS snippets_author_id_idx
  ON snippets (author_id);

CREATE INDEX IF NOT EXISTS snippets_language_idx
  ON snippets (language);`,
  },
  {
    id: "tpl-react-hook",
    name: "React hook",
    blurb: "useEffect cleanup pattern",
    language: "typescript",
    title: "useEventListener hook",
    description: "Attach a window listener with automatic cleanup.",
    tags: ["react", "hook"],
    code: `import { useEffect } from "react";

export function useEventListener(
  type: string,
  handler: (event: WindowEventMap[keyof WindowEventMap]) => void,
) {
  useEffect(() => {
    window.addEventListener(type, handler as EventListener);
    return () => window.removeEventListener(type, handler as EventListener);
  }, [type, handler]);
}`,
  },
  {
    id: "tpl-python-script",
    name: "Python script",
    blurb: "argparse main + type hints",
    language: "python",
    title: "Typed Python CLI",
    description: "An argparse-driven main with type hints and a clean exit path.",
    tags: ["python", "cli"],
    code: `import argparse
from pathlib import Path


def run(path: Path, dry_run: bool = False) -> None:
    if dry_run:
        print(f"[dry-run] would process {path}")
        return
    print(f"processed {path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Process a file.")
    parser.add_argument("path", type=Path, help="file to process")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    run(args.path, args.dry_run)


if __name__ == "__main__":
    main()`,
  },
  {
    id: "tpl-css-utility",
    name: "CSS utility",
    blurb: "Container + clamp() fluid type",
    language: "css",
    title: "Fluid container scale",
    description: "A responsive container and a clamp-based type scale.",
    tags: ["css", "layout"],
    code: `.container {
  width: 100%;
  max-width: 72rem;
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 3rem);
}

.fluid-h1 {
  font-size: clamp(2rem, 6vw, 4rem);
  line-height: 1.05;
  text-wrap: balance;
}`,
  },
];

export function templatesForLanguage(
  language: Language,
): SnippetTemplate[] {
  return templates.filter((template) => template.language === language);
}
