const currencyFormatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  maximumFractionDigits: 0
});

export function formatSek(value: number): string {
  const formatted = currencyFormatter.format(Math.abs(value));
  if (value < 0) {
    return `-${formatted}`;
  }
  return formatted;
}

export function formatPercentDelta(current: number, previous: number): string {
  if (previous === 0) {
    return current === 0 ? "0%" : "+100%";
  }
  const delta = ((current - previous) / Math.abs(previous)) * 100;
  const rounded = Math.round(delta);
  return `${rounded >= 0 ? "+" : ""}${rounded}%`;
}

export function formatMinutesAsHours(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours}h ${remaining}m`;
}

export function riskLabel(level: "LOW" | "ELEVATED" | "HIGH"): string {
  if (level === "LOW") {
    return "Låg risk";
  }
  if (level === "ELEVATED") {
    return "Förhöjd risk";
  }
  return "Hög risk";
}
