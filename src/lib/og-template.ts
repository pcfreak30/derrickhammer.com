import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// Brand tokens mirrored from src/styles/global.css so the OG card matches the site.
const COLORS = {
  bg: "#f9f8f5",
  text: "#1a1a19",
  textSecondary: "#55554f",
  accent: "#98331f",
  border: "#e5e2db",
};

// Resolve font files. During the Astro build `process.cwd()` is the project root,
// which is where node_modules lives, so a single parent fallback is enough.
function findAsset(relativePath: string): string {
  const fromCwd = resolve(process.cwd(), relativePath);
  if (existsSync(fromCwd)) return fromCwd;
  return resolve(process.cwd(), "../", relativePath);
}

const FONT_DIR = findAsset("node_modules/@fontsource/roboto/files");

function loadFont(weight: number): Buffer {
  const path = `${FONT_DIR}/roboto-latin-${weight}-normal.woff`;
  return readFileSync(path);
}

export interface OGConfig {
  name: string;
  title: string;
  description?: string;
  /** Short social handles shown top-right, e.g. ["x/pcfreak30", "in/derrickhammer"] */
  socials?: string[];
}

export async function generateOGImage(config: OGConfig): Promise<Uint8Array> {
  const fonts = [
    { name: "Roboto", data: loadFont(400), weight: 400 as const, style: "normal" as const },
    { name: "Roboto", data: loadFont(500), weight: 500 as const, style: "normal" as const },
    { name: "Roboto", data: loadFont(700), weight: 700 as const, style: "normal" as const },
  ];

  const { name, title, description, socials = [] } = config;

  const tree = {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: COLORS.bg,
        fontFamily: "Roboto",
        padding: "64px 72px",
      },
      children: [
        // Name + handle top row
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            },
            children: [
              {
                type: "div",
                props: {
                  style: { fontSize: 28, fontWeight: 700, color: COLORS.text },
                  children: name,
                },
              },
              ...(socials.length > 0
                ? [{
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        gap: "20px",
                        fontSize: 20,
                        fontWeight: 500,
                        color: COLORS.accent,
                      },
                      children: socials.map((s) => ({
                        type: "span",
                        props: { children: s },
                      })),
                    },
                  }]
                : []),
            ],
          },
        },
        // Headline + description
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", gap: "20px" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 56,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    color: COLORS.text,
                    maxWidth: 880,
                  },
                  children: title,
                },
              },
              ...(description
                ? [{
                    type: "div",
                    props: {
                      style: {
                        fontSize: 24,
                        fontWeight: 400,
                        lineHeight: 1.45,
                        color: COLORS.textSecondary,
                        maxWidth: 780,
                      },
                      children: description,
                    },
                  }]
                : []),
            ],
          },
        },
        // Accent rule + domain footer
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", gap: "18px" },
            children: [
              {
                type: "div",
                props: {
                  style: { width: 56, height: 4, backgroundColor: COLORS.accent },
                },
              },
              {
                type: "div",
                props: {
                  style: { fontSize: 20, fontWeight: 500, color: COLORS.textSecondary },
                  children: "derrickhammer.com",
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(tree as any, {
    width: 1200,
    height: 630,
    fonts,
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  const pngData = resvg.render();
  return new Uint8Array(pngData.asPng());
}
