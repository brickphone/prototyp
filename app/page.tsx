import { RiskExperience } from "@/components/risk/RiskExperience";

const gameCards = [
  { title: "Starburst", subtitle: "Slots", color: "from-orange-500/70 to-amber-300/40" },
  { title: "Neon Roulette", subtitle: "Live Casino", color: "from-cyan-500/60 to-blue-400/30" },
  { title: "Blackjack VIP", subtitle: "Bord", color: "from-zinc-100/45 to-slate-500/30" },
  { title: "Gonzo's Quest", subtitle: "Slots", color: "from-sky-400/50 to-emerald-300/30" },
  { title: "Crazy Time", subtitle: "Live Casino", color: "from-rose-400/45 to-fuchsia-500/25" }
];

export default function HomePage(): JSX.Element {
  return (
    <main className="min-h-screen overflow-hidden bg-bg text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(20,184,111,0.18),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,74,95,0.16),transparent_30%)]" />
      <section className="relative z-10 mx-auto max-w-[1200px] px-6 pb-16 pt-6 md:px-8 md:pt-10">
        <header className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-low/80 text-xl font-bold">M</div>
            <div>
              <p className="font-display text-2xl leading-none">Mr Green</p>
              <p className="text-sm text-white/60">Responsible Gaming Addon</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60">Saldo</p>
            <p className="text-2xl font-semibold">12 450 kr</p>
          </div>
        </header>

        <div>
          <h1 className="font-display text-5xl leading-none tracking-tight">Välkommen tillbaka</h1>
          <p className="mt-2 text-base text-white/65">Här är dina populära spel</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {gameCards.map((card) => (
            <article
              key={card.title}
              className={`relative h-[290px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${card.color}`}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(3,10,19,0.85))]" />
              <div className="absolute bottom-3 left-3 z-10">
                <p className="text-2xl font-semibold leading-none">{card.title}</p>
                <p className="text-sm text-white/70">{card.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <RiskExperience />
    </main>
  );
}
