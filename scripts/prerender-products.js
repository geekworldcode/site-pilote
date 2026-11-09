import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import siteConfig from "../src/config/site.config.json" with { type: "json" };

const root = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const dist = path.join(root, "dist");
const shell = await readFile(path.join(dist, "index.html"), "utf8");
const css = [...shell.matchAll(/<link[^>]+href="([^"]+\.css)"[^>]*>/g)].map((match) => match[0]).join("\n    ");
const baseUrl = new URL(process.env.SITE_URL || process.env.VITE_SITE_URL || siteConfig.site.canonicalUrl).origin;
const esc = (value = "") => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

for (const product of siteConfig.products) {
  const slug = product.seoSlug || product.id;
  const route = `/produits/${slug}/`;
  const canonical = new URL(route, `${baseUrl}/`).href;
  const title = product.seoTitle || `${product.brand} ${product.model} : avis, caractéristiques et prix | ${siteConfig.site.name}`;
  const description = (product.seoDescription || `${product.summary} Consultez les caractéristiques, les points forts et le prix indicatif.`).slice(0, 155);
  const image = product.image?.src || siteConfig.site.socialImage;
  const specs = [
    ["Capacité", `${product.specs.capacityWh} Wh`],
    ["Puissance", `${product.specs.outputW} W`],
    ["Poids", `${product.specs.weightKg} kg`],
    ["Batterie", product.specs.batteryType]
  ];
  const positives = product.pros.map((pro) => `<li>${esc(pro)}</li>`).join("\n          ");
  const specRows = specs.map(([label, value]) => `<tr><th scope="row">${esc(label)}</th><td>${esc(value)}</td></tr>`).join("\n          ");
  const schemaProduct = {
    "@type": "Product",
    name: `${product.brand} ${product.model}`,
    description: product.summary,
    image: [image],
    brand: { "@type": "Brand", name: product.brand },
    sku: product.id
  };
  if (product.ratingIsVerified === true && Number.isFinite(product.rating) && Number.isInteger(product.ratingCount) && product.ratingCount > 0) {
    schemaProduct.aggregateRating = { "@type": "AggregateRating", ratingValue: product.rating, ratingCount: product.ratingCount, bestRating: 5, worstRating: 1 };
  }
  if (product.verifiedOffer?.verified === true && product.verifiedOffer.priceEUR > 0 && product.verifiedOffer.availability) {
    schemaProduct.offers = { "@type": "Offer", price: product.verifiedOffer.priceEUR, priceCurrency: "EUR", availability: product.verifiedOffer.availability, priceValidUntil: product.verifiedOffer.priceValidUntil || `${new Date().getFullYear()}-12-31`, url: product.verifiedOffer.url || product.links.brand };
  }
  const jsonLd = JSON.stringify({ "@context": "https://schema.org", "@graph": [
    schemaProduct,
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Comparatif", item: `${baseUrl}/#comparatif` },
      { "@type": "ListItem", position: 3, name: `${product.brand} ${product.model}`, item: canonical }
    ] }
  ] }).replace(/</g, "\\u003c");

  const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${esc(canonical)}" />
    ${css}
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image" content="${esc(image)}" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:type" content="product" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${esc(image)}" />
    <link rel="preload" as="image" href="${esc(image)}" fetchpriority="high" />
    <script type="application/ld+json">${jsonLd}</script>
  </head>
  <body class="bg-slate-50 text-slate-950 antialiased">
    <header class="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur-xl">
      <nav aria-label="Navigation principale" class="mx-auto flex max-w-5xl items-center justify-between">
        <a href="/" class="font-extrabold text-slate-950">${esc(siteConfig.site.name)}</a>
        <a href="/#comparatif" class="font-bold text-emerald-900 underline underline-offset-4">Retour au comparatif</a>
      </nav>
    </header>
    <main id="contenu" class="mx-auto max-w-5xl px-5 py-10 sm:py-16">
      <nav aria-label="Fil d’Ariane" class="mb-8 text-sm text-slate-700"><a href="/" class="underline underline-offset-4">Accueil</a> <span aria-hidden="true">/</span> <a href="/#comparatif" class="underline underline-offset-4">Comparatif</a> <span aria-hidden="true">/</span> <span aria-current="page">${esc(product.brand)} ${esc(product.model)}</span></nav>
      <article aria-labelledby="product-title" class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <header class="grid gap-8 p-6 sm:p-10 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] md:items-center">
          <section><p class="font-bold uppercase tracking-widest text-emerald-900">${esc(product.brand)}</p><h1 id="product-title" class="mt-2 text-4xl font-extrabold tracking-tight">${esc(product.model)} : avis et caractéristiques</h1><p class="mt-5 text-lg leading-8 text-slate-700">${esc(product.summary)}</p><p class="mt-5 text-sm font-semibold text-slate-800">Score éditorial de démonstration : ${esc(product.expertScore)}/10</p></section>
          <img src="${esc(image)}" alt="${esc(product.image?.alt || `${product.brand} ${product.model}`)}" width="640" height="480" fetchpriority="high" decoding="async" class="mx-auto max-h-80 w-full object-contain" />
        </header>
        <section aria-labelledby="specs-title" class="border-t border-slate-200 p-6 sm:p-10"><h2 id="specs-title" class="text-2xl font-extrabold">Fiche technique</h2><div class="mt-5 overflow-x-auto"><table class="w-full text-left"><caption class="sr-only">Caractéristiques de ${esc(product.brand)} ${esc(product.model)}</caption><tbody class="divide-y divide-slate-200">${specRows}</tbody></table></div></section>
        <section aria-labelledby="expert-title" class="border-t border-slate-200 bg-slate-50 p-6 sm:p-10"><h2 id="expert-title" class="text-2xl font-extrabold">L’avis de l’expert</h2><p class="mt-4 leading-7 text-slate-800">${esc(product.expertReview)}</p><h3 class="mt-7 text-lg font-bold">Points forts</h3><ul class="mt-3 list-inside list-disc space-y-2 text-slate-800">${positives}</ul></section>
        <aside aria-label="Prix et liens marchands" class="border-t border-slate-200 p-6 sm:p-10"><p class="text-sm font-semibold text-slate-700">Prix indicatif</p><p class="mt-1 text-3xl font-extrabold">${eur.format(product.priceEUR)}</p><p class="mt-2 text-sm text-slate-700">${esc(product.priceNote)} ${esc(product.stockUrgency)}</p><a href="${esc(product.links.amazon)}" target="_blank" rel="sponsored nofollow noopener noreferrer" class="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 font-extrabold text-white">Vérifier le stock</a><a href="${esc(product.links.brand)}" target="_blank" rel="sponsored nofollow noopener noreferrer" class="ml-4 inline-flex min-h-12 items-center font-bold text-emerald-900 underline underline-offset-4">Voir chez ${esc(product.brand)}</a></aside>
      </article>
      <footer class="mt-8 text-sm text-slate-700"><p>${esc(siteConfig.site.priceDisclaimer)}</p><p class="mt-2"><a href="/#comparatif" class="font-bold text-emerald-900 underline underline-offset-4">Comparer avec les autres générateurs solaires portables</a></p></footer>
    </main>
  </body>
</html>`;

  const outputDir = path.join(dist, "produits", slug);
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "index.html"), html, "utf8");
}

console.log(`Prerendered ${siteConfig.products.length} product detail pages.`);
