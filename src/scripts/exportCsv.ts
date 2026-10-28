import { writeFileSync } from "node:fs";
import { prisma } from "../database/prisma.js";
import { limpar } from "../utils/csv.js";

const nulo = (v: unknown) => (v === null || v === undefined || v === "" ? "NULL" : v);

async function main() {
  const autorias = await prisma.authorship.findMany({
    include: {
      work: true,
      author: true,
      institutions: { include: { institution: true } },
    },
  });

  const colunas = [
    "id_trabalho", "titulo", "ano", "autor", "orcid",
    "posicao", "instituicao", "pais_instituicao",
  ];

  const linhas: string[] = [];

  for (const a of autorias) {
    const base = [a.work.id, a.work.title, a.work.year, a.author.name, nulo(a.author.orcid), a.position];

    if (a.institutions.length === 0) {
      linhas.push([...base, "NULL", "NULL"].map(limpar).join(";"));
      continue;
    }

    for (const { institution } of a.institutions) {
      linhas.push(
        [...base, nulo(institution.name), nulo(institution.countryCode)].map(limpar).join(";"),
      );
    }
  }

  const cabecalho = colunas.map(limpar).join(";");
  writeFileSync("data/autorias.csv", "\uFEFF" + [cabecalho, ...linhas].join("\r\n"), "utf-8");
  console.log("Linhas gravadas:", linhas.length);
}

main().finally(() => prisma.$disconnect());