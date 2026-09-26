import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { seedSnippets } from "@/lib/snippet-data";
import { useSnippetStore } from "@/store/snippet.store";
import { LANGUAGE_META } from "@/lib/languages";

export const runtime = "edge";

/**
 * Social preview for a share link: title, language chip, and a peek at the
 * code, so a CodeVault URL pasted into Slack/Notion/X renders as a card
 * instead of a bare link.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;

  const snippet =
    seedSnippets.find((item) => item.id === token) ??
    useSnippetStore.getState().snippets.find((item) => item.id === token);

  if (!snippet) {
    return new Response("Not found", { status: 404 });
  }

  const meta = LANGUAGE_META[snippet.language];
  const preview = snippet.code.split("\n").slice(0, 14).join("\n");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#101418",
          color: "#e6ebf2",
          padding: "56px",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "34px",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "9999px",
              backgroundColor: "#2FBF9B",
            }}
          />
          <span
            style={{
              fontSize: "22px",
              letterSpacing: "0.08em",
              color: "#8fa6bc",
              textTransform: "uppercase",
            }}
          >
            CodeVault · {meta.label}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "46px",
            fontWeight: 600,
            lineHeight: 1.15,
            marginBottom: "18px",
            color: "#f4f7fa",
          }}
        >
          {snippet.title}
        </div>

        {snippet.description ? (
          <div style={{ display: "flex", fontSize: "22px", color: "#8fa6bc" }}>
            {snippet.description}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            marginTop: "36px",
            borderRadius: "14px",
            border: "1px solid #233040",
            backgroundColor: "#161e27",
            padding: "24px 28px",
            overflow: "hidden",
          }}
        >
          <pre
            style={{
              display: "flex",
              fontSize: "20px",
              lineHeight: 1.5,
              color: "#c9d4e0",
              margin: 0,
              whiteSpace: "pre",
            }}
          >
            {preview}
          </pre>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontSize: "18px",
            color: "#5f7285",
          }}
        >
          by {snippet.authorName}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
