"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 -mx-4 border-b border-slate-200 bg-white/95 px-4 pt-3 backdrop-blur">
      <div className="flex items-center justify-between pb-3">
        <Link href="/" className="group inline-flex items-center gap-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-white shadow-soft">
            <Image src="/logo-jab.png" alt="JAB" fill className="object-contain" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight text-slate-900 group-hover:text-slate-700">
              Jovem Aprendiz Brasil
            </div>
            <div className="text-xs text-slate-500">Guia + vagas para começar</div>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-soft"
          aria-label="Abrir menu"
          aria-expanded={open}
        >
          <span className="flex h-3 flex-col justify-between">
            <span className="block h-[2px] w-5 rounded-full bg-slate-800" />
            <span className="block h-[2px] w-4 rounded-full bg-slate-800" />
            <span className="block h-[2px] w-3 rounded-full bg-slate-800" />
          </span>
        </button>
      </div>

      {open && (
        <nav className="space-y-1 pb-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-slate-900/80 p-3 text-slate-50 shadow-soft backdrop-blur">
            <Link
              href="/auth"
              className="block rounded-xl bg-sky-500 px-4 py-2 text-center text-sm font-semibold text-white shadow-soft"
              onClick={() => setOpen(false)}
            >
              Cadastre-se / Login
            </Link>

            <Link
              href="/#comece"
              className="mt-1 block rounded-xl px-4 py-2 text-left text-sm hover:bg-slate-800/60"
              onClick={() => setOpen(false)}
            >
              Comece por aqui
            </Link>
            <Link
              href="/vagas"
              className="block rounded-xl px-4 py-2 text-left text-sm hover:bg-slate-800/60"
              onClick={() => setOpen(false)}
            >
              Buscar vagas
            </Link>
            <Link
              href="/comunidade"
              className="block rounded-xl px-4 py-2 text-left text-sm hover:bg-slate-800/60"
              onClick={() => setOpen(false)}
            >
              Grupos e comunidade
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
