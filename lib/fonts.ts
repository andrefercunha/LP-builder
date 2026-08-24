import type { FontId } from "./types";

export const FONT_CATALOG: Record<
  FontId,
  { label: string; family: string; href: string; role: "display" | "sans" | "either" }
> = {
  "instrument-serif": {
    label: "Instrument Serif",
    family: '"Instrument Serif", Georgia, serif',
    href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap",
    role: "display",
  },
  newsreader: {
    label: "Newsreader",
    family: '"Newsreader", Georgia, serif',
    href: "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap",
    role: "display",
  },
  fraunces: {
    label: "Fraunces",
    family: '"Fraunces", Georgia, serif',
    href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&display=swap",
    role: "display",
  },
  playfair: {
    label: "Playfair Display",
    family: '"Playfair Display", Georgia, serif',
    href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&display=swap",
    role: "display",
  },
  "source-serif": {
    label: "Source Serif 4",
    family: '"Source Serif 4", Georgia, serif',
    href: "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap",
    role: "either",
  },
  syne: {
    label: "Syne",
    family: '"Syne", system-ui, sans-serif',
    href: "https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&display=swap",
    role: "display",
  },
  bebas: {
    label: "Bebas Neue",
    family: '"Bebas Neue", Impact, sans-serif',
    href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap",
    role: "display",
  },
  outfit: {
    label: "Outfit",
    family: '"Outfit", system-ui, sans-serif',
    href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap",
    role: "sans",
  },
  "dm-sans": {
    label: "DM Sans",
    family: '"DM Sans", system-ui, sans-serif',
    href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap",
    role: "sans",
  },
  "libre-franklin": {
    label: "Libre Franklin",
    family: '"Libre Franklin", system-ui, sans-serif',
    href: "https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,400;0,500;0,600;1,400&display=swap",
    role: "sans",
  },
};

export function fontHref(ids: FontId[]) {
  const unique = Array.from(new Set(ids));
  return unique.map((id) => FONT_CATALOG[id].href);
}

export function fontFamily(id: FontId) {
  return FONT_CATALOG[id].family;
}
