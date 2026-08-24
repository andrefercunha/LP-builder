import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseBriefMarkdown } from "../lib/brief-md";
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

if (failed) {
  process.exit(1);
}
