/**
 * Single source of truth for the marketing copy that lives in more than one
 * place: the landing sections render it and the JSON-LD structured data
 * mirrors it. Editing a FAQ here updates both the accordion and the
 * schema.org FAQPage — the two can never drift apart.
 *
 * Plain data only: no JSX, no client-only imports, so the same module is
 * safe to consume from server components (structured data) and client
 * components (the sections themselves).
 */

export const siteName = "CodeVault";

export const siteTagline = "Your Modern Code Snippet Library";

export const siteDescription =
  "CodeVault is your centralized, syntax-aware code snippet library. Store, organize, search, and reuse the code you write — with Monaco editing, tagging, and private/public control.";

/** Public origin, used for absolute URLs in structured data and crawlers. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.BETTER_AUTH_URL ??
  "https://codevault-olive.vercel.app";

export const author = {
  name: "Rahul Sain",
  url: "https://github.com/Anos714",
} as const;

export const socials = {
  repo: "https://github.com/Anos714/CodeVault",
  github: "https://github.com/Anos714",
  x: "https://x.com/RahulSain714",
  linkedin: "https://linkedin.com/in/rahulxcode",
  license: "https://github.com/Anos714/CodeVault/blob/main/LICENSE",
} as const;

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    question: "Is CodeVault free?",
    answer:
      "Yes. CodeVault is open source under the MIT license — you can self-host it or use the hosted version at no cost.",
  },
  {
    question: "Do I need an account to browse public snippets?",
    answer:
      "Anyone can browse and view public snippets. An account is only required to create, edit, and manage your own private snippets.",
  },
  {
    question: "Which languages are supported?",
    answer:
      "Anything you can type. Syntax highlighting covers the popular languages out of the box, and the Monaco editor handles dozens more.",
  },
  {
    question: "Can I keep snippets private?",
    answer:
      "Every snippet defaults to private. Flip a single switch to make it public and shareable whenever you want.",
  },
  {
    question: "Is my data portable?",
    answer:
      "It is your code. You can copy any snippet to your clipboard in one click, and the source is fully open if you'd rather self-host.",
  },
];

export type StepItem = {
  step: string;
  title: string;
  description: string;
  note: string;
};

export const steps: StepItem[] = [
  {
    step: "01",
    title: "Capture",
    description:
      "Paste a snippet or write it fresh in the Monaco editor. Add a title, a note, and pick the language.",
    note: "No forms to fight. The editor is already there.",
  },
  {
    step: "02",
    title: "Organize",
    description:
      "Tag it with #auth, #regex, or whatever fits. Mark it public to share, or keep it private.",
    note: "Flat tags beat deep folders when you are in a hurry.",
  },
  {
    step: "03",
    title: "Reuse",
    description:
      "Search by title, language, or tag — then copy it in one click. That utility is never lost again.",
    note: "Or insert it straight into Chrome and VS Code.",
  },
];

/** Stable ids so each feature can map to its icon/visual in the section. */
export type FeatureId =
  | "editor"
  | "search"
  | "tags"
  | "privacy"
  | "copy"
  | "themes";

export type FeatureItem = {
  id: FeatureId;
  title: string;
  description: string;
  iconLabel: string;
  chip: string;
  span: string;
};

export const features: FeatureItem[] = [
  {
    id: "editor",
    title: "A real editor, in your browser",
    description:
      "The same engine that powers VS Code — real syntax highlighting, indentation, and instant language switching.",
    iconLabel: "Editor",
    chip: "bg-sky/70 text-ink",
    span: "sm:col-span-2 lg:col-span-4",
  },
  {
    id: "search",
    title: "Search that actually finds it",
    description: "Match on title, language, description, or tags.",
    iconLabel: "Search",
    chip: "bg-butter/80 text-ink",
    span: "sm:col-span-2 lg:col-span-2",
  },
  {
    id: "tags",
    title: "Tags, not folders",
    description: "Organize flat and fast with #tags that travel with your code.",
    iconLabel: "Tags",
    chip: "bg-blush/60 text-ink",
    span: "lg:col-span-2",
  },
  {
    id: "privacy",
    title: "Private by default",
    description: "Keep snippets to yourself, or flip one switch to share.",
    iconLabel: "Privacy",
    chip: "bg-aqua/70 text-ink",
    span: "lg:col-span-2",
  },
  {
    id: "copy",
    title: "Copy, don't rewrite",
    description: "One click and it's on your clipboard — ready to ship.",
    iconLabel: "Copy",
    chip: "bg-periwinkle/70 text-ink",
    span: "lg:col-span-2",
  },
  {
    id: "themes",
    title: "Calm by day, focused by night",
    description:
      "A quiet light theme and a deep dark one — both tuned for long reading sessions.",
    iconLabel: "Themes",
    chip: "bg-success/15 text-success",
    span: "sm:col-span-2 lg:col-span-6",
  },
];
