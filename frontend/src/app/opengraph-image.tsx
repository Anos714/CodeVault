import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Social card for every page that doesn't ship its own: 1200×630 with the
 * brand mark and headline over the same hills painting the hero uses.
 *
 * Fonts and images are read once at module scope — the response has no
 * request-time dependencies, so Next prerenders it at build time and caches
 * it. (Satori only understands a flex subset of CSS; spacing is kept in
 * explicit margins/paddings rather than shorthands it may not parse.)
 */
export const alt = "CodeVault — your modern code snippet library";
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

const chips = [
  { label: "Monaco editor", bg: "#9eccff" },
  { label: "#tags not folders", bg: "#ffd673" },
  { label: "One-click copy", bg: "#fa8c8f" },
  { label: "Private by default", bg: "#b3bdff" },
  { label: "Chrome + VS Code", bg: "#9ee0f2" },
];

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
          paddingTop: 52,
          paddingRight: 56,
          paddingBottom: 44,
          paddingLeft: 56,
          background: "linear-gradient(#3f9fe6 0%, #7ec5ef 100%)",
          color: "#ffffff",
          fontFamily: "Inter",
          fontWeight: 400,
        }}
      >
        {/* the hills painting — same asset as the hero background */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: 300,
            overflow: "hidden",
          }}
        >
          <img
            width={1200}
            height={675}
            src={hillsSrc}
            alt=""
            style={{ position: "absolute", left: 0, top: -270 }}
          />
        </div>

        {/* sky shade so the copy stays legible over the painting */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(180deg, rgba(5,40,95,0.55) 0%, rgba(5,40,95,0.38) 45%, rgba(5,40,95,0.30) 62%, rgba(5,40,95,0.08) 78%, rgba(5,40,95,0) 90%)",
          }}
        />

        {/* ---------- content ---------- */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", flex: 1 }}>
          {/* brand row */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <img width={64} height={64} src={logoSrc} alt="" />
            <span
              style={{
                marginLeft: 18,
                fontSize: 40,
                fontWeight: 700,
                letterSpacing: "-1.2px",
              }}
            >
              CodeVault
            </span>
            <span
              style={{
                marginLeft: "auto",
                paddingTop: 10,
                paddingRight: 20,
                paddingBottom: 10,
                paddingLeft: 20,
                borderRadius: 999,
                background: "rgba(11,11,15,0.28)",
                fontSize: 19,
                fontWeight: 600,
                color: "rgba(255,255,255,0.95)",
              }}
            >
              Open source · MIT
            </span>
          </div>

          {/* headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 44,
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-2.4px",
            }}
          >
            <span>Your modern</span>
            <span style={{ display: "flex" }}>
              <span
                style={{
                  fontFamily: "Instrument Serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  letterSpacing: "-1px",
                }}
              >
                code
              </span>
              <span>{" snippet library"}</span>
            </span>
          </div>

          {/* subline — one expression child so it wraps as a single text node;
              narrowed so it stays over the misty mountains, never the sunlit
              house where white text would lose contrast */}
          <div
            style={{
              marginTop: 20,
              maxWidth: 700,
              fontSize: 24,
              lineHeight: 1.45,
              color: "rgba(255,255,255,0.94)",
            }}
          >
            {"The syntax-aware snippet library for developers — Monaco editing, flat #tags, one-click copy. Free and open source."}
          </div>

          {/* feature chips */}
          <div style={{ display: "flex", marginTop: 26 }}>
            {chips.map((chip) => (
              <span
                key={chip.label}
                style={{
                  marginRight: 12,
                  paddingTop: 9,
                  paddingRight: 18,
                  paddingBottom: 9,
                  paddingLeft: 18,
                  borderRadius: 999,
                  background: chip.bg,
                  fontSize: 19,
                  fontWeight: 600,
                  color: "#0b0b0f",
                }}
              >
                {chip.label}
              </span>
            ))}
          </div>

          {/* footer bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "auto",
              paddingTop: 16,
              paddingRight: 26,
              paddingBottom: 16,
              paddingLeft: 26,
              borderRadius: 18,
              background: "rgba(9,14,26,0.55)",
            }}
          >
            <span style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-0.2px" }}>
              github.com/Anos714/CodeVault
            </span>
            <span
              style={{
                fontSize: 19,
                fontWeight: 500,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              Chrome &amp; VS Code extensions included
            </span>
          </div>
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
