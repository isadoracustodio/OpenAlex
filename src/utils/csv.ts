export function limpar(valor: unknown): string {
  const s = String(valor ?? "").replace(/\s+/g, " ").trim().slice(0, 32000);
  return `"${s.replaceAll('"', '""')}"`;
}