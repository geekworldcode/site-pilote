import { ArrowUpRight, BatteryCharging, Check, ImageOff, Leaf, ShieldCheck, Star, Truck, Weight, Zap } from "lucide-react";
import { useState } from "react";

const badgeTones = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  slate: "border-slate-200 bg-slate-100 text-slate-800"
};

const trustIcons = [ShieldCheck, Truck, Leaf];

const formatEuro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0
});

function ProductCardUltra({ product, rank }) {
  const [imageFailed, setImageFailed] = useState(false);
  const { capacityWh, weightKg, outputW, batteryType } = product.specs;
  const badgeTone = badgeTones[product.badgeTone] ?? badgeTones.emerald;
  const titleId = `product-${product.id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className="group relative overflow-hidden rounded-[1.75rem] border border-slate-100/80 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_42px_rgb(15,23,42,0.10)]"
    >
      <div className="grid lg:grid-cols-[180px_minmax(0,1fr)_230px]">
        <figure className="relative flex min-h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50 p-6 lg:min-h-full">
          <span aria-hidden="true" className="absolute -left-10 -top-10 size-40 rounded-full border border-emerald-200/70" />
          <span aria-hidden="true" className="absolute -left-3 -top-3 size-28 rounded-full border border-emerald-100" />
          <span className="absolute left-4 top-4 z-10 grid size-9 place-items-center rounded-xl border border-white bg-white/95 text-xs font-black text-slate-800 shadow-sm" aria-label={`Rang ${rank}`}>
            #{rank}
          </span>
          {product.badge && <span className={`absolute right-3 top-4 z-10 max-w-[65%] rounded-full border px-3 py-1.5 text-[10px] font-extrabold shadow-sm ${badgeTone}`}>{product.badge}</span>}
          {product.image?.src && !imageFailed ? (
            <img
              src={product.image.src}
              alt={product.image.alt || `${product.brand} ${product.model}`}
              width="640"
              height="480"
              loading={rank === 1 ? "eager" : "lazy"}
              fetchPriority={rank === 1 ? "high" : "auto"}
              decoding="async"
              onError={() => setImageFailed(true)}
              className="relative z-0 max-h-56 w-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105 lg:max-h-64"
            />
          ) : (
            <span aria-label={`Image produit indisponible pour ${product.brand} ${product.model}`} className="relative z-0 grid size-28 place-items-center rounded-3xl border border-slate-300 bg-white text-slate-600 shadow-sm">
              <ImageOff size={30} aria-hidden="true" />
            </span>
          )}
        </figure>

        <section aria-label={`Détails de ${product.brand} ${product.model}`} className="min-w-0 p-5 sm:p-7 lg:px-8 lg:py-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">{product.brand}</p>
              <h3 id={titleId} className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950"><a className="rounded-sm underline-offset-4 hover:text-emerald-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-800" href={`/produits/${product.id}/`}>{product.model}<span className="sr-only"> — fiche détaillée</span></a></h3>
            </div>
            <span className="inline-flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-2 text-sm font-extrabold text-slate-900" aria-label={`${product.rating.toFixed(1)} sur 5, ${product.ratingLabel}`}>
              <Star size={15} aria-hidden="true" className="fill-amber-500 text-amber-600" /> {product.rating.toFixed(1)}
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">{product.summary}</p>

          <section aria-label="Caractéristiques techniques" className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100/80 p-2 sm:grid-cols-4">
            <Spec icon={BatteryCharging} label="Capacité" value={`${capacityWh.toLocaleString("fr-FR")} Wh`} />
            <Spec icon={Weight} label="Poids" value={`${weightKg.toLocaleString("fr-FR")} kg`} />
            <Spec icon={Zap} label="Puissance" value={`${outputW.toLocaleString("fr-FR")} W`} />
            <Spec icon={Leaf} label="Batterie" value={batteryType} />
          </section>

          <ul aria-label="Points forts" className="mt-5 grid gap-x-5 gap-y-2 sm:grid-cols-2">
            {product.pros.map((pro) => (
              <li key={pro} className="flex items-start gap-2.5 text-xs leading-5 text-slate-700">
                <span aria-hidden="true" className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-900"><Check size={11} strokeWidth={3} /></span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>

          <blockquote className="mt-5 rounded-2xl border-l-2 border-emerald-600 bg-slate-100 px-4 py-3 text-sm italic leading-6 text-slate-800">
            <p><span className="not-italic font-bold text-slate-950">L'avis de l'expert</span> — {product.expertReview}</p>
          </blockquote>
        </section>

        <aside aria-label="Prix et réassurance" className="flex flex-col justify-between border-t border-slate-200 bg-slate-50/80 p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-6">
          <section aria-label="Prix et disponibilité">
            <p className="text-xs font-semibold text-slate-700">Prix indicatif</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950">{formatEuro.format(product.priceEUR)}</p>
            <p className="mt-1 text-xs leading-5 text-slate-700">{product.priceNote}</p>
            <p className="mt-3 inline-flex items-start gap-1.5 text-xs font-semibold leading-5 text-amber-900">
              <span aria-hidden="true" className="mt-1 size-2 shrink-0 rounded-full bg-amber-500" /> {product.stockUrgency}
            </p>
          </section>

          <ul aria-label="Informations de confiance" className="mt-5 grid gap-2">
            {product.trustBadges.map((badge, index) => {
              const Icon = trustIcons[index % trustIcons.length];
              return <li key={badge} className="flex items-center gap-2 text-[11px] font-semibold text-slate-700"><Icon size={14} aria-hidden="true" className="shrink-0 text-emerald-800" /> {badge}</li>;
            })}
          </ul>

          <div className="mt-5 space-y-2">
            <a
              href={product.links.amazon}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              aria-label={`Vérifier le stock de ${product.brand} ${product.model} sur Amazon`}
              className="group/cta motion-safe:animate-[soft-pulse_2.8s_ease-in-out_3] inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3 text-sm font-extrabold text-white shadow-[0_8px_20px_rgb(5,150,105,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
            >
              Vérifier le stock <ArrowUpRight size={16} aria-hidden="true" className="transition-transform group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
            </a>
            <a href={product.links.brand} target="_blank" rel="sponsored nofollow noopener noreferrer" className="inline-flex min-h-10 w-full items-center justify-center rounded-xl px-3 py-2 text-xs font-bold text-slate-700 underline-offset-4 hover:text-emerald-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700">
              Voir chez {product.brand}
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}

function Spec({ icon: Icon, label, value }) {
  return (
    <article className="rounded-xl bg-white px-3 py-3 shadow-sm shadow-slate-200/70">
      <p className="flex items-center gap-1.5 text-slate-700"><Icon size={15} aria-hidden="true" /><span className="text-[10px] font-bold uppercase tracking-wide">{label}</span></p>
      <p className="mt-1.5 text-sm font-extrabold tracking-tight text-slate-900">{value}</p>
    </article>
  );
}

export default ProductCardUltra;
