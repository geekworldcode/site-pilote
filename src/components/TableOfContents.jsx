import { ListTree } from "lucide-react";
import siteConfig from "../config/site.config.json";

function TableOfContents({ sections = siteConfig.guide.sections }) {
  return (
    <aside aria-label="Sommaire du guide d'achat" className="hidden lg:block">
      <nav aria-label="Sommaire du guide" className="sticky top-24 rounded-3xl border border-slate-100/80 bg-white/85 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
        <h2 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
          <ListTree size={17} aria-hidden="true" className="text-emerald-700" /> Dans ce guide
        </h2>
        <ol className="mt-4 space-y-1 border-l border-slate-200 pl-3">
          {sections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="group flex gap-2 rounded-lg px-2 py-2 text-xs leading-5 text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700"
              >
                <span aria-hidden="true" className="font-bold tabular-nums text-slate-500 group-hover:text-emerald-800">{String(index + 1).padStart(2, "0")}</span>
                <span>{section.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}

export default TableOfContents;
