import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { env, UNIMAR_ID, DATA_DIR, JSONL_PATH } from "../config/env.js";
import type { OpenAlexListResponse, OpenAlexWork } from "../types/openalex.js";

const BASE =
  `https://api.openalex.org/works` +
  `?filter=authorships.institutions.lineage:${UNIMAR_ID}` +
  `&include_xpac=true&per_page=100`;

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));


async function buscarPagina(cursor: string, tentativas = 4): Promise<OpenAlexListResponse<OpenAlexWork>> {
  const url = `${BASE}&cursor=${encodeURIComponent(cursor)}`;

  for (let i = 1; i <= tentativas; i++) {
    const resposta = await fetch(url, {
      headers: { Authorization: `Bearer ${env.OPENALEX_API_KEY}` },
    });

    if (resposta.ok) {
      return (await resposta.json()) as OpenAlexListResponse<OpenAlexWork>;
    }

    if (resposta.status === 429 || resposta.status >= 500) {
      console.log(`HTTP ${resposta.status}, tentativa ${i}/${tentativas}...`);
      await esperar(2000 * i);
      continue;
    }
    throw new Error(`Erro HTTP ${resposta.status}`);
  }
  throw new Error("Falhou após várias tentativas");
}

async function main() {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(JSONL_PATH, "");

  let cursor: string | null = "*";
  let total = 0;
  let pagina = 0;
  let esperado = 0;

  while (cursor) {
    const dados = await buscarPagina(cursor);
    esperado = dados.meta.count;

    for (const trabalho of dados.results) {
      appendFileSync(JSONL_PATH, JSON.stringify(trabalho) + "\n");
      total++;
    }

    cursor = dados.meta.next_cursor;
    pagina++;
    console.log(`Página ${pagina}: ${total} registros salvos`);
  }

  console.log(`Baixados: ${total} | Esperado: ${esperado}`);
}

main();