import { ArrowDown, ArrowRight, Check, Leaf, ShieldCheck, SunMedium } from "lucide-react";
import PriceComparator from "./components/PriceComparator";
import SeoEngine from "./components/SeoEngine";
import AdvancedSchema from "./components/AdvancedSchema";
import SeoBreadcrumbs from "./components/SeoBreadcrumbs";
import StickyMobileCTA from "./components/StickyMobileCTA";
import TableOfContents from "./components/TableOfContents";
import siteConfig from "./config/site.config.json";

function VersusSection() {
  const versus = siteConfig.versus;
  const productsById = Object.fromEntries(siteConfig.products.map((product) => [product.id, product]));
  const comparedProducts = versus.productIds.map((id) => productsById[id]).filter(Boolean);

  return (
    <section id="versus" aria-labelledby="versus-title" className="scroll-mt-24 bg-slate-50 px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
      <article className="mx-auto max-w-7xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-800">Face-à-face</p>
        <h2 id="versus-title" className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">{versus.title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">{versus.intro}</p>
        <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <caption className="sr-only">Comparaison entre {comparedProducts.map((product) => `${product.brand} ${product.model}`).join(" et ")}</caption>
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-800">
              <tr><th scope="col" className="px-4 py-4 sm:px-6">Critère</th>{comparedProducts.map((product) => <th scope="col" key={product.id} className="px-4 py-4 sm:px-6">{product.brand} {product.model}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {versus.criteria.map((criterion) => (
                <tr key={criterion.label}>
                  <th scope="row" className="px-4 py-4 font-semibold text-slate-800 sm:px-6">{criterion.label}</th>
                  {comparedProducts.map((product) => {
                    const value = criterion.specKey === "priceEUR" ? product.priceEUR : criterion.specKey === "expertScore" ? product.expertScore : product.specs[criterion.specKey];
                    return <td key={product.id} className="px-4 py-4 font-bold tabular-nums text-slate-950 sm:px-6">{Number(value).toLocaleString("fr-FR")} {criterion.unit}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

function updatedLabel(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  const monthAndYear = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(date);
  return `Mise à jour : ${monthAndYear.charAt(0).toLocaleUpperCase("fr-FR")}${monthAndYear.slice(1)}`;
}

function GuideSection() {
  const guide = siteConfig.guide;
  return (
    <section id="guide" aria-labelledby="guide-title" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
      <article className="mx-auto max-w-7xl">
        <header className="mb-9 max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-800">Le guide SolarNomade</p>
          <h2 id="guide-title" className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">{guide.title}</h2>
          <p className="mt-4 text-base leading-7 text-slate-700">{guide.intro}</p>
        </header>
        <section aria-label="Conseils pour choisir une station solaire portable" className="grid gap-9 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start">
          <TableOfContents sections={guide.sections} />
          <section aria-label="Chapitres du guide d'achat" className="space-y-4">
            {guide.sections.map((section, index) => (
              <article id={section.id} key={section.id} className="scroll-mt-28 rounded-3xl border border-slate-100/80 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8">
                <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-emerald-800">Conseil {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-950">{section.title}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">{section.body}</p>
              </article>
            ))}
          </section>
        </section>
      </article>
    </section>
  );
}

function App() {
  const { trustSignals, site, faqs } = siteConfig;

  return (
    <section aria-label={site.description} className="min-h-screen overflow-hidden bg-slate-50 text-slate-950 antialiased">
      <SeoEngine />
      <AdvancedSchema />
      <a href="#contenu-principal" className="sr-only z-[100] rounded-lg bg-white px-4 py-3 font-bold text-slate-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Aller au contenu principal</a>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 shadow-[0_4px_20px_rgb(15,23,42,0.04)] backdrop-blur-xl">
        <section className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8 lg:px-10">
          <a href="#accueil" aria-label={`${site.name}, accueil`} className="inline-flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800">
            <span aria-hidden="true" className="grid size-10 place-items-center rounded-2xl bg-emerald-700 text-white shadow-sm"><SunMedium size={22} /></span>
            <span className="text-base font-extrabold tracking-tight">Solar<span className="text-emerald-800">Nomade</span></span>
          </a>
          <nav aria-label="Navigation principale" role="navigation" className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
            <a className="rounded-sm hover:text-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-800" href="#comparatif">Comparatif</a>
            <a className="rounded-sm hover:text-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-800" href="#versus">Face-à-face</a>
            <a className="rounded-sm hover:text-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-800" href="#guide">Guide d'achat</a>
            <a className="rounded-sm hover:text-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-800" href="#faq">FAQ</a>
          </nav>
          <a href="#comparatif" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800">Comparer <ArrowRight size={15} aria-hidden="true" /></a>
        </section>
      </header>

      <aside aria-label="Signaux de confiance" className="border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
        <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-5 py-3 text-[11px] font-bold text-slate-800 sm:px-8 lg:justify-start lg:px-10">
          <li className="inline-flex items-center gap-1.5"><Check size={14} aria-hidden="true" className="text-emerald-800" /> {trustSignals.independenceLabel}</li>
          <li>{trustSignals.methodologyLabel}</li>
          <li>{trustSignals.updatedAt ? updatedLabel(trustSignals.updatedAt) : trustSignals.updatedLabel}</li>
        </ul>
      </aside>

      <SeoBreadcrumbs />

      <main id="contenu-principal" className="pb-28 md:pb-0">
        <section aria-labelledby="hero-title" className="relative isolate px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:px-10 lg:pt-20">
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(16,185,129,0.13),transparent_65%)]" />
          <article className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
            <section className="max-w-3xl">
              <p className="mb-6 inline-flex -rotate-1 items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.15em] text-emerald-900 shadow-sm"><Leaf size={14} aria-hidden="true" /> L'énergie, librement</p>
              <h1 id="hero-title" className="text-5xl font-extrabold leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[4.6rem]">Du soleil dans le sac. <span className="text-emerald-800">Du courant</span> partout.</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700 sm:text-xl">Comparez les générateurs solaires portables selon votre autonomie, votre puissance et votre façon de voyager.</p>
              <section className="mt-8 flex flex-wrap items-center gap-4" aria-label="Accès rapide au comparatif">
                <a href="#comparatif" className="inline-flex min-h-14 items-center gap-3 rounded-2xl bg-emerald-700 px-6 text-sm font-extrabold text-white shadow-[0_8px_24px_rgb(4,120,87,0.2)] transition-all hover:-translate-y-1 hover:bg-emerald-800 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900">Voir le comparatif <ArrowDown size={17} aria-hidden="true" /></a>
                <p className="text-xs font-semibold text-slate-700">{siteConfig.products.length} modèles · prix indicatifs</p>
              </section>
            </section>

            <article aria-label="Illustration d'une station d'énergie nomade" className="relative mx-auto grid aspect-square w-full max-w-md place-items-center overflow-hidden rounded-[2.5rem] border border-white bg-gradient-to-br from-emerald-100 via-white to-amber-50 shadow-[0_18px_60px_rgb(15,23,42,0.09)]">
              <span aria-hidden="true" className="absolute inset-8 rounded-full border border-emerald-200/80" />
              <span aria-hidden="true" className="absolute inset-16 rounded-full border border-emerald-200/60" />
              <section aria-hidden="true" className="relative z-10 w-[58%] rounded-[2rem] border border-slate-600 bg-gradient-to-br from-slate-700 to-slate-950 p-4 shadow-2xl shadow-slate-950/25 transition-transform duration-500 hover:-rotate-2">
                <p className="flex items-center justify-between text-[9px] font-extrabold uppercase tracking-[0.17em] text-emerald-300"><span>SolarNomade</span><span className="size-2 rounded-full bg-emerald-400" /></p>
                <span className="mx-auto my-7 grid size-24 place-items-center rounded-full border border-emerald-300/20 bg-emerald-300/5 text-emerald-300"><SunMedium size={54} strokeWidth={1.2} /></span>
                <p className="border-t border-white/15 pt-3 text-center text-xs font-bold tracking-widest text-slate-200">ÉNERGIE NOMADE</p>
              </section>
              <aside className="absolute bottom-[12%] right-[7%] rounded-2xl border border-white bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md"><p className="flex items-center gap-2 text-xs font-bold text-slate-900"><ShieldCheck size={16} aria-hidden="true" className="text-emerald-800" /> Choix éclairé</p></aside>
            </article>
          </article>
        </section>

        <section id="comparatif" aria-labelledby="comparatif-title" className="scroll-mt-24 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <article className="mx-auto max-w-7xl">
            <header className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <section><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-800">Le comparatif SolarNomade</p><h2 id="comparatif-title" className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Trouvez votre station, en toute clarté.</h2></section>
              <p className="max-w-sm text-sm leading-6 text-slate-700">Filtrez par batterie, cherchez un modèle et triez selon vos priorités.</p>
            </header>
            <PriceComparator />
            <p className="mt-6 text-xs leading-5 text-slate-700">{site.priceDisclaimer} {site.ratingsDisclaimer}</p>
          </article>
        </section>

        <VersusSection />
        <GuideSection />

        <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <article className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[0.7fr_1.3fr]">
            <header><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-800">Réponses pratiques</p><h2 id="faq-title" className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Les questions fréquentes</h2></header>
            <section aria-label="Questions et réponses techniques" className="divide-y divide-slate-200 border-y border-slate-200">
              {faqs.map((faq) => <details key={faq.question} className="group py-5"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-slate-950 marker:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-800">{faq.question}<span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full border border-slate-300 text-lg text-slate-800 transition-transform group-open:rotate-45">+</span></summary><p className="max-w-3xl pr-10 pt-3 text-sm leading-7 text-slate-700">{faq.answer}</p></details>)}
            </section>
          </article>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 px-5 py-8 sm:px-8 lg:px-10">
        <section className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <a href="#accueil" aria-label={`Retour à l'accueil ${site.name}`} className="inline-flex items-center gap-2 text-sm font-extrabold"><SunMedium size={18} aria-hidden="true" className="text-emerald-800" /> {site.name}</a>
          <p className="max-w-xl text-xs leading-5 text-slate-700">Certains liens sont affiliés. Une commission peut être versée au site, sans coût supplémentaire pour vous.</p>
          <p className="text-xs text-slate-700">© {new Date().getFullYear()} {site.name}</p>
        </section>
      </footer>
      <StickyMobileCTA />
    </section>
  );
}

export default App;
