import type { Metadata } from "next";
import { headers } from "next/headers";

import { SnippetForm } from "@/app/dashboard/new/snippet-form";
import { auth } from "@/server/auth";

export const metadata: Metadata = {
  title: "New snippet",
};

/**
 * Server component: the composer opens on the user's own default visibility
 * (settings → "New snippets default to private"), not a hardcoded value.
 */
export default async function NewSnippetPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <SnippetForm
      defaultVisibility={
        session?.user.defaultPrivate === false ? "public" : "private"
      }
    />
  );
}
