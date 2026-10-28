import { readFileSync } from "node:fs";
import { JSONL_PATH } from "../config/env.js";
import { prisma } from "../database/prisma.js";
import { toWorkData } from "./transform.js";
import type { OpenAlexWork } from "../types/openalex.js";

async function salvarTrabalho(w: OpenAlexWork) {
  const dados = toWorkData(w);

  await prisma.$transaction(
    async (tx) => {
      await tx.work.upsert({
        where: { id: w.id },
        create: { id: w.id, ...dados },
        update: dados,
      });

      await tx.authorship.deleteMany({ where: { workId: w.id } });

      for (const a of w.authorships ?? []) {
        if (!a.author?.id) continue;

        await tx.author.upsert({
          where: { id: a.author.id },
          create: {
            id: a.author.id,
            name: a.author.display_name ?? "",
            orcid: a.author.orcid ?? null,
          },
          update: {
            name: a.author.display_name ?? "",
            orcid: a.author.orcid ?? undefined,
          },
        });

        const instituicoes = new Map<string, NonNullable<typeof a.institutions>[number]>();
        for (const inst of a.institutions ?? []) {
          if (inst.id) instituicoes.set(inst.id, inst);
        }

        for (const inst of instituicoes.values()) {
          await tx.institution.upsert({
            where: { id: inst.id },
            create: {
              id: inst.id,
              name: inst.display_name ?? "",
              ror: inst.ror ?? null,
              countryCode: inst.country_code ?? null,
            },
            update: {
              name: inst.display_name ?? "",
              ror: inst.ror ?? null,
              countryCode: inst.country_code ?? null,
            },
          });
        }

        await tx.authorship.create({
          data: {
            workId: w.id,
            authorId: a.author.id,
            position: a.author_position ?? null,
            institutions: {
              create: [...instituicoes.keys()].map((institutionId) => ({ institutionId })),
            },
          },
        });
      }
    },
    { timeout: 60_000 }, 
  );
}

async function main() {
  const trabalhos: OpenAlexWork[] = readFileSync(JSONL_PATH, "utf-8")
    .split("\n")
    .filter((linha) => linha.trim() !== "")
    .map((linha) => JSON.parse(linha));

  let feitos = 0;
  for (const w of trabalhos) {
    await salvarTrabalho(w);
    feitos++;
    if (feitos % 100 === 0) console.log(`${feitos}/${trabalhos.length}`);
  }

  console.log(`Concluído: ${feitos} trabalhos`);
  console.log("Autores:", await prisma.author.count());
  console.log("Instituições:", await prisma.institution.count());
  console.log("Autorias:", await prisma.authorship.count());
}

main().finally(() => prisma.$disconnect());