import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import siteConfig from "../config/site.config.json";
import ProductCardUltra from "./ProductCardUltra";

const sortOptions = siteConfig.filters.sortOptions;
const batteryOptions = siteConfig.filters.batteryTypes;

function PriceComparator() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [batteryType, setBatteryType] = useState(batteryOptions[0]);

  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get("q") || "");
  }, []);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr-FR");
    const filtered = siteConfig.products.filter((product) => {
      const searchableText = [product.brand, product.model, product.summary, product.specs.batteryType, ...product.pros]
        .join(" ")
        .toLocaleLowerCase("fr-FR");
      const matchesSearch = searchableText.includes(normalizedQuery);
      const matchesBattery = batteryType === batteryOptions[0] || product.specs.batteryType === batteryType;
      return matchesSearch && matchesBattery;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "price-asc") return a.priceEUR - b.priceEUR;
      if (sortBy === "price-desc") return b.priceEUR - a.priceEUR;
      if (sortBy === "expert-score") return b.expertScore - a.expertScore;
      return b.expertScore - a.expertScore;
    });
  }, [query, sortBy, batteryType]);

  return (
    <section aria-label="Recherche et filtres du comparatif" className="w-full">
      <form role="search" action="/" method="get" className="mb-7 grid gap-3 rounded-3xl border border-slate-100/80 bg-slate-50 p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:grid-cols-[minmax(0,1fr)_210px_190px] sm:p-4">
        <label className="relative min-w-0">
          <span className="sr-only">Rechercher une station ou une caractéristique</span>
          <Search size={19} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            type="search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={siteConfig.filters.searchPlaceholder}
            className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700" aria-label="Effacer la recherche">
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </label>

        <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <SlidersHorizontal size={17} aria-hidden="true" className="shrink-0 text-emerald-800" />
          <span className="sr-only">{siteConfig.filters.sortLabel}</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="w-full cursor-pointer bg-transparent text-sm font-semibold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
            {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>

        <label className="flex min-h-12 items-center rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <span className="sr-only">Filtrer par type de batterie</span>
          <select value={batteryType} onChange={(event) => setBatteryType(event.target.value)} className="w-full cursor-pointer bg-transparent text-sm font-semibold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
            {batteryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
      </form>

      <p className="mb-5 px-1 text-sm font-semibold text-slate-800" aria-live="polite" role="status">
        {visibleProducts.length} station{visibleProducts.length === 1 ? "" : "s"} dans la sélection
      </p>

      <section aria-label="Résultats du comparatif" className="space-y-5">
        {visibleProducts.map((product, index) => <ProductCardUltra key={product.id} product={product} rank={index + 1} />)}
      </section>

      {visibleProducts.length === 0 && (
        <aside role="status" className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
          <p className="font-bold text-slate-900">Aucune station ne correspond à cette recherche.</p>
          <p className="mt-1 text-sm text-slate-700">Essayez une autre marque, capacité ou chimie de batterie.</p>
        </aside>
      )}
    </section>
  );
}

export default PriceComparator;
