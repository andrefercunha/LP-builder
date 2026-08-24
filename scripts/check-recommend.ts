import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseBriefMarkdown } from "../lib/brief-md";
import { describeLook, lookFromProject } from "../lib/look";
import { SISTEMA_MARKDOWN, sistemaPagesFromMd } from "../lib/pages-from-md";
import { recommendPage } from "../lib/recommend";
import { TEST_BRIEFS } from "../lib/test-briefs";

let failed = 0;
for (const item of TEST_BRIEFS) {
  const raw = readFileSync(resolve(process.cwd(), `public${item.file}`), "utf8");
  const parsed = parseBriefMarkdown(raw);
  const got = recommendPage(parsed.copy).template;
  if (got !== item.expectTemplate) {
    failed += 1;
    console.error(`FAIL ${item.name}: expected ${item.expectTemplate}, got ${got}`);
  } else {
    console.log(`ok  ${item.name} → ${got}`);
  }
}

const template = parseBriefMarkdown(
  readFileSync(resolve(process.cwd(), "public/briefs/formato.md"), "utf8"),
);
if (!template.copy.headline.trim()) {
  failed += 1;
  console.error("FAIL formato.md did not parse a headline");
}

const sistemaFile = readFileSync(resolve(process.cwd(), "public/briefs/sistema-crescimento.md"), "utf8");
if (sistemaFile.trim() !== SISTEMA_MARKDOWN.trim()) {
  failed += 1;
  console.error("FAIL SISTEMA_MARKDOWN drifted from public/briefs/sistema-crescimento.md");
}

const sistemaPages = sistemaPagesFromMd(4);
const looks = new Set(sistemaPages.map((page) => describeLook(lookFromProject(page))));
if (sistemaPages.length !== 4 || looks.size !== 4) {
  failed += 1;
  console.error(`FAIL same .md must produce 4 distinct looks, got ${[...looks].join(" | ")}`);
} else {
  console.log("ok  mesmo-md → 4 looks from sistema-crescimento.md");
  for (const page of sistemaPages) {
    console.log(`     ${page.id} · ${describeLook(lookFromProject(page))}`);
  }
}

if (failed) {
  process.exit(1);
}
