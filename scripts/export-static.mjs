import { mkdirSync, writeFileSync } from "node:fs";
import puppeteer from "puppeteer-core";

const BASE = "http://127.0.0.1:3000";
const IDS = ["sistema-md-1", "sistema-md-2", "sistema-md-3", "sistema-md-4"];

mkdirSync("docs", { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

for (const id of IDS) {
  await page.goto(`${BASE}/preview/${id}`, { waitUntil: "networkidle0", timeout: 60000 });
  await page.waitForSelector(".lp-c-close", { timeout: 30000 });
  await new Promise((resolve) => setTimeout(resolve, 800));

  const html = await page.evaluate(() => {
    const doc = document.documentElement.cloneNode(true);
    doc.querySelectorAll("script, nextjs-portal, [data-nextjs-toast]").forEach((node) => node.remove());
    const styles = Array.from(document.styleSheets)
      .filter((sheet) => sheet.href?.includes("/_next/"))
      .map((sheet) =>
        Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n"),
      )
      .join("\n");
    doc.querySelectorAll('link[href*="/_next/"]').forEach((node) => node.remove());
    const style = document.createElement("style");
    style.textContent = styles;
    doc.querySelector("head").appendChild(style);
    return `<!DOCTYPE html>${doc.outerHTML}`;
  });

  writeFileSync(`docs/${id}.html`, html);
  console.log(`written docs/${id}.html (${(html.length / 1024).toFixed(0)} KB)`);
}

await browser.close();
