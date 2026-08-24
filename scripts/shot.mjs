import puppeteer from "puppeteer-core";

const [, , url, out] = process.argv;

const browser = await puppeteer.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
await page.waitForSelector(".lp-c-close", { timeout: 30000 });
await new Promise((resolve) => setTimeout(resolve, 1200));
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`written ${out}`);
