import { TEST_BRIEFS } from "../lib/test-briefs";
import { recommendPage } from "../lib/recommend";

let failed = 0;
for (const item of TEST_BRIEFS) {
  const got = recommendPage(item.copy).template;
  if (got !== item.expectTemplate) {
    failed += 1;
    console.error(`FAIL ${item.name}: expected ${item.expectTemplate}, got ${got}`);
  } else {
    console.log(`ok  ${item.name} → ${got}`);
  }
}

if (failed) {
  process.exit(1);
}
