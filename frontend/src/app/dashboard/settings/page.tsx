"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Check,
  Globe,
  Lock,
  LogOut,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useSnippetStore } from "@/store/snippet.store";
import { clearPersistedSession } from "@/components/providers/session-provider";
import { staggerContainer, fadeUp } from "@/lib/motion";
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

export default function SettingsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const snippets = useSnippetStore((state) => state.snippets);

  const [name, setName] = useState(user?.name ?? "");
  const [email] = useState(user?.email ?? "");
  const [defaultPrivate, setDefaultPrivate] = useState(true);
  const [saved, setSaved] = useState(false);

  const mine = snippets.filter((snippet) => snippet.authorId === user?.id);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    if (user) useAuthStore.setState({ user: { ...user, name: name.trim() } });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleSignOut = () => {
    clearPersistedSession();
    signOut();
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
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name}
                className="size-14 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-14 items-center justify-center rounded-full bg-primary/15 font-mono text-sm font-semibold text-primary">
                {initials(user?.name ?? "Developer")}
              </span>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-foreground">
                {user?.name}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {user?.email}
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
              {mine.length} snippet{mine.length === 1 ? "" : "s"} on this account
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
            onChange={(event) => setDefaultPrivate(event.target.checked)}
            className="sr-only"
          />
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
