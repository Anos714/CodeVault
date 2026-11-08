import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Social card for every page that doesn't ship its own: 1200×630 — the hills
 * painting under a left-weighted brand-blue wash, "Your code, remembered."
 * in Inter + Instrument Serif, and the search pill bleeding off the bottom
 * edge as a teaser.
 *
 * Fonts and images are read once at module scope — the response has no
 * request-time dependencies, so Next prerenders it at build time and caches
 * it. (Satori only understands a flex subset of CSS; spacing is kept in
 * explicit margins/paddings rather than shorthands it may not parse, and
 * every wrapper sets display:flex explicitly.)
 */
export const alt = "CodeVault — your code, remembered.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const [interRegular, interSemiBold, interBold, serifItalic, hills, logo] =
  await Promise.all([
    readFile(join(process.cwd(), "assets/og/400-normal.woff")),
    readFile(join(process.cwd(), "assets/og/600-normal.woff")),
    readFile(join(process.cwd(), "assets/og/700-normal.woff")),
    readFile(join(process.cwd(), "assets/og/serif-italic.woff")),
    readFile(join(process.cwd(), "public/bg/hills.jpg")),
    readFile(join(process.cwd(), "public/icon-512.png")),
  ]);

const hillsSrc = `data:image/jpeg;base64,${hills.toString("base64")}`;
const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          paddingTop: 46,
          paddingRight: 56,
          paddingBottom: 0,
          paddingLeft: 56,
          background: "#0b4a9e",
          color: "#ffffff",
          fontFamily: "Inter",
          fontWeight: 400,
        }}
      >
        {/* the hills painting — full bleed behind everything */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <img
            width={1200}
            height={675}
            src={hillsSrc}
            alt=""
            style={{ position: "absolute", left: 0, top: -22 }}
          />
        </div>

        {/* brand-blue wash: heavy over the copy, clear over the house */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(102deg, rgba(7,52,128,0.96) 0%, rgba(8,58,140,0.90) 22%, rgba(10,68,152,0.70) 42%, rgba(12,80,166,0.40) 62%, rgba(14,92,178,0.14) 80%, rgba(0,0,0,0) 96%)",
          }}
        />

        {/* ---------- content ---------- */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          {/* brand row */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <img width={54} height={54} src={logoSrc} alt="" />
            <span
              style={{
                marginLeft: 16,
                fontSize: 38,
                fontWeight: 700,
                letterSpacing: "-1px",
              }}
            >
              CodeVault
            </span>
          </div>

          {/* headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 40,
            }}
          >
            <span
              style={{
                display: "flex",
                fontSize: 96,
                fontWeight: 700,
                letterSpacing: "-3.5px",
                lineHeight: 1,
              }}
            >
              Your code,
            </span>
            <span
              style={{
                display: "flex",
                fontFamily: "Instrument Serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 104,
                letterSpacing: "-1.5px",
                lineHeight: 1.04,
                marginTop: 6,
              }}
            >
              remembered.
            </span>
          </div>

          {/* subline — one expression child so it wraps as a single text node */}
          <div
            style={{
              display: "flex",
              marginTop: 24,
              maxWidth: 650,
              fontSize: 27,
              lineHeight: 1.44,
              color: "rgba(255,255,255,0.95)",
            }}
          >
            {"The calm, syntax-aware home for the snippets you keep rewriting."}
          </div>

          {/* fine print */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "auto",
              paddingBottom: 56,
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: "rgba(255,255,255,0.96)",
              }}
            >
              Free · open source · works in Chrome &amp; VS Code
            </span>
          </div>
        </div>

        {/* search pill — deliberately bleeding off the bottom edge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "absolute",
            right: 56,
            top: 578,
            height: 74,
            paddingLeft: 26,
            paddingRight: 18,
            borderRadius: 999,
            background: "linear-gradient(180deg, #303030 0%, #171717 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 0 0 1px rgba(255,255,255,0.08), 0 18px 36px -16px rgba(0,0,0,0.7)",
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 600, color: "#ffffff" }}>
            Search your vault
          </span>
          <span
            style={{
              marginLeft: 16,
              paddingTop: 6,
              paddingRight: 10,
              paddingBottom: 6,
              paddingLeft: 10,
              borderRadius: 10,
              background: "rgba(255,255,255,0.12)",
              fontSize: 14,
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            ⌘K
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: interRegular, weight: 400, style: "normal" },
        { name: "Inter", data: interSemiBold, weight: 600, style: "normal" },
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
        {
          name: "Instrument Serif",
          data: serifItalic,
          weight: 400,
          style: "italic",
        },
      ],
    },
  );
}
