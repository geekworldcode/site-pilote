import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import siteConfig from "../src/config/site.config.json" with { type: "json" };

const projectRoot = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const publicDir = path.join(projectRoot, "public");
const configuredUrl = process.env.SITE_URL || process.env.VITE_SITE_URL || siteConfig.site.canonicalUrl;
const siteUrl = new URL(configuredUrl);
if (!/^https?:$/.test(siteUrl.protocol)) throw new Error("SITE_URL doit utiliser http ou https.");
const baseUrl = siteUrl.origin;
const lastmod = siteConfig.trustSignals?.updatedAt || new Date().toISOString().slice(0, 10);
const paths = new Set((siteConfig.site.indexablePaths || ["/"]).filter((item) => typeof item === "string" && item.startsWith("/") && !item.includes("#")));

for (const product of siteConfig.products || []) {
  const slug = product.seoSlug || product.id;
  if (slug) paths.add(`/produits/${slug}/`);
}

const escapeXml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
const urlEntries = [...paths].map((pathname) => {
  const loc = escapeXml(new URL(pathname, `${baseUrl}/`).href);
  const priority = pathname === "/" ? "1.0" : "0.8";
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}).join("\n");
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

const robotLines = ["User-agent: *", "Allow: /"];
for (const crawler of siteConfig.site.robots?.aiCrawlers || []) {
  robotLines.push("", `User-agent: ${crawler.userAgent}`);
  for (const rule of crawler.allow || []) robotLines.push(`Allow: ${rule}`);
  for (const rule of crawler.disallow || []) robotLines.push(`Disallow: ${rule}`);
}
robotLines.push("", `Sitemap: ${baseUrl}/sitemap.xml`, "");

await mkdir(publicDir, { recursive: true });
await Promise.all([
  writeFile(path.join(publicDir, "sitemap.xml"), sitemapXml, "utf8"),
  writeFile(path.join(publicDir, "robots.txt"), robotLines.join("\n"), "utf8")
]);
console.log(`Generated sitemap.xml and robots.txt for ${baseUrl}`);
