import siteConfig from "../config/site.config.json";

function absoluteUrl(value, origin) {
  if (!value) return origin;
  try {
    return new URL(value, origin).href;
  } catch {
    return origin;
  }
}

function SeoEngine({ page = {}, products = siteConfig.products }) {
  const configuredUrl = import.meta.env.VITE_SITE_URL || siteConfig.site.canonicalUrl;
  const origin = typeof window === "undefined" ? new URL(configuredUrl).origin : window.location.origin;
  const canonical = absoluteUrl(page.canonicalUrl || configuredUrl, origin);
  const title = page.title || siteConfig.site.seoTitle;
  const description = (page.description || siteConfig.site.seoDescription || "").slice(0, 155);
  const image = absoluteUrl(page.image || siteConfig.site.socialImage, origin);
  const minItems = siteConfig.site.minIndexableProducts ?? 3;
  const noindex = Boolean(page.isThinContent ?? siteConfig.site.isThinContent)
    || products.length < minItems;
  const robots = noindex
    ? "noindex, follow"
    : "index, follow, max-image-preview:large";
  const heroProduct = [...products].sort((a, b) => b.expertScore - a.expertScore)[0];
  const heroImage = heroProduct?.image?.src;
  const languages = page.languages || siteConfig.languages || [];
  const fonts = page.preloadFonts || siteConfig.site.preloadFonts || [];

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={page.locale || siteConfig.site.locale || "fr_FR"} />
      <meta property="og:site_name" content={siteConfig.site.name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {heroImage && <link rel="preload" as="image" href={heroImage} fetchPriority="high" />}
      {fonts.map((font) => (
        <link key={font.href} rel="preload" href={font.href} as="font" type={font.type || "font/woff2"} crossOrigin="anonymous" />
      ))}
      {languages.map((language) => (
        <link key={language.code} rel="alternate" hrefLang={language.code} href={absoluteUrl(language.url, origin)} />
      ))}
      {languages.length > 0 && <link rel="alternate" hrefLang="x-default" href={canonical} />}
    </>
  );
}

export default SeoEngine;
