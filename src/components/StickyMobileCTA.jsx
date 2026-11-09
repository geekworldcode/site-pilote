import { ArrowUpRight, BadgeCheck } from "lucide-react";
import siteConfig from "../config/site.config.json";

const formatEuro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0
});

function StickyMobileCTA() {
  const recommendedProduct = [...siteConfig.products].sort(
    (a, b) => b.expertScore - a.expertScore
  )[0];

  if (!recommendedProduct) return null;

  return (
    <aside
      aria-label={`Offre recommandée : ${recommendedProduct.brand} ${recommendedProduct.model}`}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/95 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 shadow-[0_-8px_30px_rgb(15,23,42,0.12)] backdrop-blur-xl md:hidden"
      role="complementary"
    >
      <section className="mx-auto flex max-w-xl items-center gap-3" aria-label="Meilleure recommandation du comparatif">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-800">
            <BadgeCheck size={13} aria-hidden="true" /> Recommandé #1
          </p>
          <p className="truncate text-xs font-bold text-slate-900">{recommendedProduct.brand} {recommendedProduct.model}</p>
          <p className="text-xs font-semibold text-slate-700">Dès {formatEuro.format(recommendedProduct.priceEUR)}</p>
        </div>
        <a
          href={recommendedProduct.links.amazon}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          aria-label={`Vérifier le stock de ${recommendedProduct.brand} ${recommendedProduct.model} sur Amazon`}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 text-xs font-extrabold text-white shadow-[0_8px_20px_rgb(5,150,105,0.25)] transition-all hover:-translate-y-0.5 hover:from-emerald-700 hover:to-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
        >
          Vérifier le stock <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </section>
    </aside>
  );
}

export default StickyMobileCTA;
