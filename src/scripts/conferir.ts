import { readFileSync } from "node:fs";
import { JSONL_PATH } from "../config/env.js";
import type { OpenAlexWork } from "../types/openalex.js";

const trabalhos: OpenAlexWork[] = readFileSync(JSONL_PATH, "utf-8")
  .split("\n")
  .filter((linha) => linha.trim() !== "")
  .map((linha) => JSON.parse(linha));

const ids = new Set(trabalhos.map((t) => t.id));
const extras = trabalhos.filter((t) => t.is_xpac);

console.log("Linhas:", trabalhos.length);
console.log("IDs diferentes:", ids.size);
console.log("Registros XPAC:", extras.length);

const porTipo: Record<string, number> = {};
for (const t of extras) {
  const tipo = t.type ?? "desconhecido";
  porTipo[tipo] = (porTipo[tipo] ?? 0) + 1;
}
console.log("Tipos dos XPAC:", porTipo);

console.log("Exemplos:");
for (const t of extras.slice(0, 5)) {
  console.log("-", t.publication_year, t.title);
}