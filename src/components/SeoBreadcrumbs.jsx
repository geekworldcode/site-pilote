import siteConfig from "../config/site.config.json";

function SeoBreadcrumbs({ items = siteConfig.breadcrumbs }) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const breadcrumbItems = items.map((crumb) => ({
    ...crumb,
    absoluteItem: /^https?:\/\//i.test(crumb.item)
      ? crumb.item
      : `${origin}${crumb.item}`
  }));

  return (
    <nav aria-label="Fil d’Ariane" role="navigation" className="mx-auto w-full max-w-7xl px-5 pt-5 sm:px-8 lg:px-10">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-600">
        {breadcrumbItems.map((crumb, index) => {
          const isCurrent = index === breadcrumbItems.length - 1;
          return (
            <li key={`${crumb.name}-${crumb.item}`} className="inline-flex items-center gap-2">
              {index > 0 && <span aria-hidden="true" className="text-slate-500">/</span>}
              {isCurrent ? (
                <span aria-current="page" className="font-bold text-slate-800">{crumb.name}</span>
              ) : (
                <a href={crumb.item} className="rounded-sm underline-offset-4 transition-colors hover:text-emerald-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
                  {crumb.name}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default SeoBreadcrumbs;
