import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const vite = await createServer({
  configFile: path.join(root, "vite.config.js"),
  root,
  server: { middlewareMode: true },
  appType: "custom"
});

try {
  const { default: App } = await vite.ssrLoadModule("/src/App.jsx");
  let html = await readFile(path.join(root, "dist", "index.html"), "utf8");
  html = html.replace(/<title\b[^>]*>[\s\S]*?<\/title>|<(?:meta|link)\b[^>]*\/?>/gi, (tag) => {
    if (/^<meta\b/i.test(tag) && /(?:charset|name="viewport"|name="theme-color")/i.test(tag)) return tag;
    if (/^<link\b/i.test(tag) && /rel="(?:stylesheet|modulepreload|preconnect|preload)"/i.test(tag)) return tag;
    return "";
  });
  let markup = renderToString(createElement(App));
  const headTags = [];
  markup = markup.replace(/<title\b[^>]*>[\s\S]*?<\/title>|<(?:meta|link)\b[^>]*\/?>/gi, (tag) => {
    headTags.push(tag);
    return "";
  });
  const uniqueHeadTags = [...new Set(headTags)].join("\n    ");
  html = html.replace("</head>", `${uniqueHeadTags}\n  </head>`);
  const rootMarkup = `<div id="root">${markup}</div>`;
  if (!html.includes('<div id="root"></div>')) throw new Error("Root Vite introuvable dans dist/index.html");
  html = html.replace('<div id="root"></div>', rootMarkup);
  await writeFile(path.join(root, "dist", "index.html"), html, "utf8");
  console.log("Prerendered homepage HTML for crawlers and hydration.");
} finally {
  await vite.close();
}
