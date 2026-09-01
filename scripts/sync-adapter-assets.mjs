import { copyFile, mkdir } from "node:fs/promises";

await mkdir(new URL("../static/discussionbridge/", import.meta.url), { recursive: true });
await copyFile(
  new URL("../node_modules/hugo-discussion-bridge/dist/discussionbridge-simple.js", import.meta.url),
  new URL("../static/discussionbridge/simple.js", import.meta.url),
);
await copyFile(
  new URL("../node_modules/hugo-discussion-bridge/dist/discussionbridge-rich-content.js", import.meta.url),
  new URL("../static/discussionbridge/rich-content.js", import.meta.url),
);
