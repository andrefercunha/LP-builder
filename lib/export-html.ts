import { FONT_CATALOG } from "./fonts";
import type { Project } from "./types";

export function downloadJson(project: Project) {
  const blob = new Blob([JSON.stringify(project, null, 2)], {
    type: "application/json",
  });
  triggerDownload(blob, `${slug(project.name)}.json`);
}

export function downloadHtml(markup: string, project: Project) {
  const fonts = [
    FONT_CATALOG[project.brand.headingFont].href,
    FONT_CATALOG[project.brand.bodyFont].href,
  ];
  const documentHtml = `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(project.copy.headline || project.name)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  ${fonts.map((href) => `<link href="${href}" rel="stylesheet" />`).join("\n  ")}
  <style>
    :root {
      --bg: ${project.brand.background};
      --fg: ${project.brand.foreground};
      --accent: ${project.brand.accent};
      --muted: ${project.brand.muted};
      --surface: ${project.brand.surface};
      --primary: ${project.brand.primary};
      --heading: ${FONT_CATALOG[project.brand.headingFont].family};
      --body: ${FONT_CATALOG[project.brand.bodyFont].family};
      --radius: ${project.brand.radius === "none" ? "0px" : project.brand.radius === "sm" ? "6px" : "14px"};
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; background: var(--bg); color: var(--fg); }
    body { font-family: var(--body); }
    img { max-width: 100%; display: block; }
    button, input, select { font: inherit; }
  </style>
</head>
<body>
${markup}
</body>
</html>`;
  const blob = new Blob([documentHtml], { type: "text/html" });
  triggerDownload(blob, `${slug(project.name)}.html`);
}

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

function slug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "pagina";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
