"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Check,
  Copy,
  Globe,
  KeyRound,
  Lock,
  LogOut,
  Plus,
  Sparkles,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { signOut, updateUser } from "@/lib/auth-client";
import { staggerContainer, fadeUp } from "@/lib/motion";
import type { ApiTokenSummary } from "@/lib/api-token-types";
import {
  createApiTokenAction,
  revokeApiTokenAction,
} from "@/server/actions/tokens";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

type SettingsViewProps = {
  name: string;
  email: string;
  image: string | null;
  defaultPrivate: boolean;
  snippetCount: number;
  initialTokens: ApiTokenSummary[];
};

function formatDate(value: string | null) {
  if (!value) return "never";
  // Deterministic (UTC, date only) so SSR and hydration agree regardless of
  // the browser/server locale.
  return value.slice(0, 10);
}

export function SettingsView({
  name: initialName,
  email,
  image,
  defaultPrivate: initialPrivate,
  snippetCount,
  initialTokens,
}: SettingsViewProps) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [defaultPrivate, setDefaultPrivate] = useState(initialPrivate);
  const [saved, setSaved] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  const [tokens, setTokens] = useState<ApiTokenSummary[]>(initialTokens);
  const [tokenName, setTokenName] = useState("");
  const [rawToken, setRawToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [tokenBusy, setTokenBusy] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [confirmingToken, setConfirmingToken] = useState<string | null>(null);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    await updateUser({ name: name.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  // the privacy toggle is independent of the profile form — it saves on flip
  const handleDefaultPrivate = async (value: boolean) => {
    setDefaultPrivate(value);
    await updateUser({ defaultPrivate: value });
    setPrivacySaved(true);
    setTimeout(() => setPrivacySaved(false), 1800);
  };

  const handleCreateToken = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!tokenName.trim() || tokenBusy) return;
    setTokenBusy(true);
    setTokenError(null);
    try {
      const created = await createApiTokenAction({ name: tokenName.trim() });
      setTokens((prev) => [created.token, ...prev]);
      setRawToken(created.raw);
      setTokenName("");
      setTokenCopied(false);
    } catch (error) {
      setTokenError(
        error instanceof Error ? error.message : "Could not create token.",
      );
    } finally {
      setTokenBusy(false);
    }
  };

  const handleCopyToken = async () => {
    if (!rawToken) return;
    try {
      await navigator.clipboard.writeText(rawToken);
      setTokenCopied(true);
      setTimeout(() => setTokenCopied(false), 1800);
    } catch {
      setTokenError("Could not copy — select the token and copy it manually.");
    }
  };

  const handleRevokeToken = async (id: string) => {
    if (confirmingToken !== id) {
      setConfirmingToken(id);
      return;
    }
    setTokenBusy(true);
    setTokenError(null);
    try {
      await revokeApiTokenAction(id);
      setTokens((prev) =>
        prev.map((token) =>
          token.id === id
            ? { ...token, revokedAt: new Date().toISOString() }
            : token,
        ),
      );
      setConfirmingToken(null);
    } catch (error) {
      setTokenError(
        error instanceof Error ? error.message : "Could not revoke token.",
      );
    } finally {
      setTokenBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <DashboardHeader
        eyebrow="Settings"
        title="Account & preferences"
        description="Profile details, default privacy, and the door out. Everything is stored on your account."
      />

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-5"
      >
        <motion.form
          variants={fadeUp}
          onSubmit={handleSave}
          className="flex flex-col gap-5 rounded-2xl border border-border bg-card/40 p-5 sm:p-6"
        >
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <UserIcon className="size-4 text-primary" />
            Profile
          </h2>

          <div className="flex items-center gap-4">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={name}
                className="size-14 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-14 items-center justify-center rounded-full bg-primary/15 font-mono text-sm font-semibold text-primary">
                {initials(name || "Developer")}
              </span>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-foreground">
                {name}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {email}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label
              htmlFor="settings-name"
              className="flex flex-col gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground/80"
            >
              Display name
              <input
                id="settings-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-10 rounded-lg border border-input bg-background/60 px-3 font-sans text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
              />
            </label>
            <label
              htmlFor="settings-email"
              className="flex flex-col gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground/80"
            >
              Email
              <input
                id="settings-email"
                type="email"
                value={email}
                disabled
                className="h-10 rounded-lg border border-border bg-muted/40 px-3 font-sans text-sm text-muted-foreground outline-none"
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              size="lg"
              className="h-9 gap-2 rounded-xl px-5"
            >
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
              {snippetCount} snippet{snippetCount === 1 ? "" : "s"} on this account
            </span>
          </div>
        </motion.form>

        <motion.div
          variants={fadeUp}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card/40 p-5 sm:p-6"
        >
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Lock className="size-4 text-primary" />
            Privacy
          </h2>

          <label
            htmlFor="default-private"
            className="flex cursor-pointer items-start gap-3"
          >
            <span
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border transition-colors",
                defaultPrivate
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-transparent",
              )}
            >
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-sm font-medium text-foreground">
                New snippets default to private
                {privacySaved && (
                  <span className="ml-2 font-mono text-[0.65rem] text-primary">
                    saved
                  </span>
                )}
              </span>
              <span className="text-sm leading-relaxed text-muted-foreground">
                Leave it on and you have to flip a snippet to public
                deliberately — share by choice, not by accident.
              </span>
            </span>
          </label>
          <input
            id="default-private"
            type="checkbox"
            checked={defaultPrivate}
            onChange={(event) => handleDefaultPrivate(event.target.checked)}
            className="sr-only"
          />
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card/40 p-5 sm:p-6"
        >
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <KeyRound className="size-4 text-primary" />
            API tokens
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Personal access tokens let the Chrome and VS Code extensions read
            and write this vault. Create one here, then paste it into the
            extension. Treat a token like a password — anyone holding it has
            full access to your snippets.
          </p>

          <form
            onSubmit={handleCreateToken}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <input
              aria-label="Token name"
              type="text"
              value={tokenName}
              onChange={(event) => setTokenName(event.target.value)}
              placeholder="Chrome extension"
              maxLength={60}
              className="h-10 flex-1 rounded-lg border border-input bg-background/60 px-3 font-sans text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            />
            <Button
              type="submit"
              className="h-10 gap-2 rounded-xl px-5"
              disabled={tokenBusy || !tokenName.trim()}
            >
              <Plus className="size-4" />
              {tokenBusy ? "Working…" : "Create token"}
            </Button>
          </form>

          {tokenError && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {tokenError}
            </p>
          )}

          {rawToken && (
            <div className="flex flex-col gap-2 rounded-xl border border-primary/30 bg-primary/10 p-4">
              <p className="text-sm font-medium text-foreground">
                Copy this token now — it will not be shown again.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <code
                  data-testid="raw-api-token"
                  className="min-w-0 flex-1 break-all rounded-lg bg-background/70 px-3 py-2 font-mono text-xs text-foreground"
                >
                  {rawToken}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 shrink-0 gap-2 rounded-xl px-4"
                  onClick={handleCopyToken}
                >
                  {tokenCopied ? (
                    <>
                      <Check className="size-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {tokens.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tokens yet. Create one for the Chrome extension or VS Code.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {tokens.map((token) => (
                <li
                  key={token.id}
                  className={cn(
                    "flex flex-col gap-2 rounded-xl border border-border/70 bg-background/40 p-3 sm:flex-row sm:items-center sm:justify-between",
                    token.revokedAt && "opacity-60",
                  )}
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                      {token.name}
                      {token.revokedAt && (
                        <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wide text-muted-foreground">
                          revoked
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {token.prefix}… · created {formatDate(token.createdAt)} ·
                      last used {formatDate(token.lastUsedAt)}
                    </span>
                  </div>
                  {!token.revokedAt && (
                    <Button
                      type="button"
                      variant={
                        confirmingToken === token.id
                          ? "destructive"
                          : "outline"
                      }
                      className="h-9 shrink-0 gap-2 rounded-xl px-4"
                      onClick={() => handleRevokeToken(token.id)}
                      disabled={tokenBusy}
                    >
                      <Trash2 className="size-4" />
                      {confirmingToken === token.id
                        ? "Confirm revoke"
                        : "Revoke"}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card/40 p-5 sm:p-6"
        >
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Globe className="size-4 text-primary" />
            Danger zone
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Signing out clears the local session. Your snippets stay on your
            account and reappear when you sign back in.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="h-9 gap-2 rounded-xl px-5"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
            <Button
              variant="ghost"
              className="h-9 gap-2 rounded-xl text-muted-foreground hover:text-foreground"
              render={
                <Link href="/" target="_blank" rel="noopener noreferrer" />
              }
            >
              <ArrowLeft className="size-4" />
              Back to site
            </Button>
          </div>
        </motion.div>
       </motion.div>
    </div>
  );
}
