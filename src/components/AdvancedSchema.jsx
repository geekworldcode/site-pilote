import siteConfig from "../config/site.config.json";

function AdvancedSchema() {
  const canonical = new URL(import.meta.env.VITE_SITE_URL || siteConfig.site.canonicalUrl);
  const products = siteConfig.products.map((product) => {
    const entity = {
      "@type": "Product",
      "@id": `${canonical.href}#${product.id}`,
      name: `${product.brand} ${product.model}`,
      description: product.summary,
      image: product.image?.src ? [product.image.src] : undefined,
      brand: { "@type": "Brand", name: product.brand },
      sku: product.id
    };

    if (product.ratingIsVerified === true && Number.isFinite(product.rating) && Number.isInteger(product.ratingCount) && product.ratingCount > 0) {
      entity.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        bestRating: 5,
        worstRating: 1,
        ratingCount: product.ratingCount
      };
    }

    if (product.verifiedOffer?.verified === true && product.verifiedOffer.priceEUR > 0 && product.verifiedOffer.availability) {
      entity.offers = {
        "@type": "Offer",
        price: product.verifiedOffer.priceEUR,
        priceCurrency: "EUR",
        availability: product.verifiedOffer.availability,
        priceValidUntil: product.verifiedOffer.priceValidUntil || `${new Date().getFullYear()}-12-31`,
        url: product.verifiedOffer.url || product.links.brand,
        itemCondition: "https://schema.org/NewCondition"
      };
    }

    if (product.expertReviewIsVerified === true && product.expertReview) {
      entity.review = [{
        "@type": "Review",
        name: `Avis expert : ${product.brand} ${product.model}`,
        reviewBody: product.expertReview,
        author: { "@type": "Organization", name: siteConfig.site.name },
        reviewRating: {
          "@type": "Rating",
          ratingValue: product.expertScore,
          bestRating: 10,
          worstRating: 1
        }
      }];
    }
    return entity;
  });

  const graph = [
    {
      "@type": "WebSite",
      "@id": `${canonical.origin}/#website`,
      url: `${canonical.origin}/`,
      name: siteConfig.site.name,
      inLanguage: siteConfig.site.locale || "fr-FR",
    },
    {
      "@type": "ItemList",
      name: siteConfig.site.nicheName,
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${product.brand} ${product.model}`
      }))
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: siteConfig.breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: new URL(crumb.item, `${canonical.origin}/`).href
      }))
    }
  ];

  const jsonLd = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />;
}

export default AdvancedSchema;
