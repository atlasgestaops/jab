"use client";

import { useMemo } from "react";

type SearchBarProps = {
  query: string;
  city: string;
  state: string;
  cities: string[];
  states: string[];
  onChange: (next: { query?: string; city?: string; state?: string }) => void;
};

export function SearchBar({ query, city, state, cities, states, onChange }: SearchBarProps) {
  const cityOptions = useMemo(() => ["", ...cities], [cities]);
  const stateOptions = useMemo(() => ["", ...states], [states]);

  return (
    <section className="rounded-xl2 border border-slate-200 bg-white p-3 shadow-soft">
      <label className="block">
        <span className="text-[11px] font-medium text-slate-500">Buscar vaga</span>
        <input
          value={query}
          onChange={(e) => onChange({ query: e.target.value })}
          placeholder="Ex.: administrativo, TI, Campinas…"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-blue-600/20 placeholder:text-slate-400 focus:bg-white focus:ring-4"
        />
      </label>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <label className="block">
          <span className="text-[11px] font-medium text-slate-500">Estado</span>
          <select
            value={state}
            onChange={(e) => onChange({ state: e.target.value, city: "" })}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-blue-600/20 focus:bg-white focus:ring-4"
          >
            {stateOptions.map((s) => (
              <option key={s || "all"} value={s}>
                {s ? s : "Todos"}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-[11px] font-medium text-slate-500">Cidade</span>
          <select
            value={city}
            onChange={(e) => onChange({ city: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-blue-600/20 focus:bg-white focus:ring-4"
          >
            {cityOptions.map((c) => (
              <option key={c || "all"} value={c}>
                {c ? c : "Todas"}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={() => onChange({ query: "", city: "", state: "" })}
        className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-soft hover:bg-slate-50"
      >
        Limpar filtros
      </button>
    </section>
  );
}

