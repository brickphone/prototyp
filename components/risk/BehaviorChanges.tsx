import { BehaviorChange } from "@/types/risk";

interface BehaviorChangesProps {
  items: BehaviorChange[];
}

const toneByDirection: Record<BehaviorChange["direction"], string> = {
  UP: "border-high/35 bg-high/10",
  DOWN: "border-low/35 bg-low/10",
  STABLE: "border-white/20 bg-white/10"
};

export function BehaviorChanges({ items }: BehaviorChangesProps): JSX.Element {
  return (
    <section>
      <p className="text-xs uppercase tracking-[0.14em] text-white/55">Beteendeförändringar</p>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <article key={item.id} className={`rounded-lg border px-3 py-2 ${toneByDirection[item.direction]}`}>
            <p className="text-sm font-semibold">{item.label}</p>
            <p className="text-xs text-white/75">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
