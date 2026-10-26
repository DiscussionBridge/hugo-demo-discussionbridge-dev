import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative, sep } from "node:path";
import { promisify } from "node:util";
import { test } from "node:test";

const execFileAsync = promisify(execFile);
const measurementId = "G-K9SYR7QENF";
const socialImage = "https://discussionbridge.dev/media/discussionbridge-open-graph.png";
const siteOrigin = "https://hugo.demo.discussionbridge.dev";

async function htmlFiles(root) {
  const found = [];
  const pending = [root];
  while (pending.length) {
    const directory = pending.pop();
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) pending.push(path);
      else if (entry.isFile() && entry.name.endsWith(".html")) found.push(path);
    }
  }
  return found.sort();
}

function expectedCanonical(root, path) {
  const name = relative(root, path).split(sep).join("/");
  if (name === "index.html") return `${siteOrigin}/`;
  if (name === "404.html") return `${siteOrigin}/404.html`;
  return `${siteOrigin}/${name.replace(/index\.html$/u, "")}`;
}

test("every production page carries exact canonical, social-image, and analytics metadata once", async (t) => {
  const destination = await mkdtemp(join(tmpdir(), "discussionbridge-hugo-production-"));
  t.after(() => rm(destination, { recursive: true, force: true }));

  await execFileAsync("hugo", ["--environment", "production", "--cleanDestinationDir", "--destination", destination], {
    cwd: process.cwd(),
    windowsHide: true,
  });

  const paths = await htmlFiles(destination);
  const ordinaryPaths = paths.filter((path) => !path.endsWith(join("discussionbridge", "page", "1", "index.html")));
  assert.equal(ordinaryPaths.length, 13);
  for (const path of ordinaryPaths) {
    const html = await readFile(path, "utf8");
    const canonical = expectedCanonical(destination, path).replaceAll(".", "\\.").replaceAll("/", "\\/");
    assert.equal(html.match(new RegExp(`<link rel="canonical" href="${canonical}"`, "gu"))?.length, 1);
    assert.equal(html.match(new RegExp(`<meta property="og:image" content="${socialImage.replaceAll(".", "\\.")}"`, "gu"))?.length, 1);
    assert.equal(html.match(new RegExp(`<meta name="twitter:image" content="${socialImage.replaceAll(".", "\\.")}"`, "gu"))?.length, 1);
    assert.equal(html.match(new RegExp(`googletagmanager\\.com/gtag/js\\?id=${measurementId}`, "gu"))?.length, 1);
    assert.equal(html.match(new RegExp(`gtag\\('config', '${measurementId}'\\)`, "gu"))?.length, 1);
  }
});

test("development output never loads the production analytics property", async (t) => {
  const destination = await mkdtemp(join(tmpdir(), "discussionbridge-hugo-development-"));
  t.after(() => rm(destination, { recursive: true, force: true }));

  await execFileAsync("hugo", ["--environment", "development", "--cleanDestinationDir", "--destination", destination], {
    cwd: process.cwd(),
    windowsHide: true,
  });

  for (const path of await htmlFiles(destination)) {
    const html = await readFile(path, "utf8");
    assert.doesNotMatch(html, new RegExp(measurementId, "u"));
    assert.doesNotMatch(html, /googletagmanager\.com\/gtag\/js/u);
  }
});
