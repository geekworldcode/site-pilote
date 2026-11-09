import { ArrowUpRight, BatteryCharging, Check, Leaf, Star, Weight, Zap } from "lucide-react";

const toneStyles = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  slate: "border-slate-200 bg-slate-100 text-slate-600"
};

const formatEuro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0
});

function ProductCard({ product, rank }) {
  const { capacityWh, weightKg, outputW, batteryType } = product.specs;
  const badgeClass = toneStyles[product.badgeTone] ?? toneStyles.emerald;

  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white shadow-sm shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-300/50">
      <div className="grid lg:grid-cols-[190px_minmax(0,1fr)_235px]">
        <div className="relative flex min-h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-emerald-50/80 to-white p-6 lg:min-h-[19rem]">
          <div className="absolute -left-12 -top-14 size-44 rounded-full border border-emerald-200/60" />
          <div className="absolute -left-5 -top-7 size-32 rounded-full border border-emerald-100/70" />
          <span className="absolute left-4 top-4 z-10 grid size-9 place-items-center rounded-xl border border-white bg-white/90 text-xs font-black text-slate-700 shadow-sm">#{rank}</span>
          {product.badge && (
            <span className={`absolute right-3 top-4 z-10 max-w-[62%] rounded-full border px-3 py-1.5 text-[10px] font-extrabold leading-tight shadow-sm ${badgeClass}`}>
              {product.badge}
            </span>
          )}
          <div className="relative mt-7 w-28 rounded-[1.55rem] border border-slate-600 bg-gradient-to-br from-slate-700 to-slate-900 p-2.5 shadow-xl shadow-slate-900/20 transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-[1.03]">
            <div className="flex aspect-[0.82] flex-col rounded-[1.1rem] border border-slate-600/80 bg-slate-800 p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[6px] font-black uppercase tracking-[0.12em] text-emerald-300">{product.brand}</span>
                <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.9)]" />
              </div>
              <div className="flex flex-1 items-center justify-center">
                <div className="grid size-12 place-items-center rounded-full border border-emerald-300/20 bg-emerald-300/5 text-emerald-300">
                  <BatteryCharging size={24} strokeWidth={1.5} />
                </div>
              </div>
              <span className="border-t border-white/10 pt-2 text-center text-[7px] font-bold tracking-[0.12em] text-slate-400">{capacityWh} WH</span>
            </div>
          </div>
          <span className="absolute bottom-5 left-1/2 h-2 w-24 -translate-x-1/2 rounded-full bg-slate-500/15 blur-sm" />
        </div>

        <div className="min-w-0 p-5 sm:p-7 lg:py-8 lg:pl-8 lg:pr-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{product.brand}</p>
              <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{product.model}</h3>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2 text-sm font-extrabold text-slate-800" title={product.ratingLabel}>
              <Star size={15} className="fill-amber-400 text-amber-400" /> {product.rating.toFixed(1)}
              <span className="sr-only">sur 5, {product.ratingLabel}</span>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">{product.summary}</p>

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-2 sm:grid-cols-4">
            <Spec icon={<BatteryCharging size={15} />} label="Capacité" value={`${capacityWh.toLocaleString("fr-FR")} Wh`} />
            <Spec icon={<Weight size={15} />} label="Poids" value={`${weightKg.toLocaleString("fr-FR")} kg`} />
            <Spec icon={<Zap size={15} />} label="Puissance" value={`${outputW.toLocaleString("fr-FR")} W`} />
            <Spec icon={<Leaf size={15} />} label="Batterie" value={batteryType} />
          </div>

          <ul className="mt-5 grid gap-x-5 gap-y-2 sm:grid-cols-2">
            {product.pros.map((pro) => (
              <li key={pro} className="flex items-start gap-2.5 text-xs leading-5 text-slate-600">
                <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check size={11} strokeWidth={3} /></span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="flex flex-col justify-between border-t border-slate-100 bg-slate-50/60 p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-6">
          <div>
            <p className="text-xs font-semibold text-slate-400">À partir de</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">{formatEuro.format(product.priceEUR)}</p>
            <p className="mt-2 text-[11px] leading-4 text-slate-400">{product.priceNote}</p>
          </div>
          <div className="mt-6 space-y-2.5">
            <a
              href={product.links.amazon}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="group/button inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-extrabold text-white shadow-md shadow-emerald-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg"
            >
              Voir le meilleur prix <ArrowUpRight size={16} className="transition-transform group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
            </a>
            <a
              href={product.links.brand}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl px-3 py-2 text-xs font-bold text-slate-500 transition-colors hover:text-emerald-700"
            >
              Voir chez {product.brand} <ArrowUpRight size={13} className="ml-1" />
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}

function Spec({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-white px-3 py-3 shadow-sm shadow-slate-200/50">
      <div className="flex items-center gap-1.5 text-slate-400">{icon}<span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span></div>
      <p className="mt-1.5 text-sm font-extrabold tracking-tight text-slate-800">{value}</p>
    </div>
  );
}

export default ProductCard;
