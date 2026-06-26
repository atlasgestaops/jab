type AdBannerProps = {
  label?: string;
};

export function AdBanner({ label = "Espaço para anúncio (AdSense futuro)" }: AdBannerProps) {
  return (
    <section
      aria-label="Banner de anúncio"
      className="rounded-xl2 border border-dashed border-slate-300 bg-white/60 p-4 text-center shadow-soft"
    >
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-[11px] text-slate-400">320×100 • placeholder</div>
    </section>
  );
}
