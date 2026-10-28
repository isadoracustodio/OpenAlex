import { prisma } from "../database/prisma.js";

export async function listarTrabalhos(opts: { page: number; limit: number; year?: number }) {
  const where = opts.year ? { year: opts.year } : {};

  const [total, itens] = await Promise.all([
    prisma.work.count({ where }),
    prisma.work.findMany({
      where,
      skip: (opts.page - 1) * opts.limit,
      take: opts.limit,
      orderBy: [{ year: "desc" }, { citations: "desc" }],
    }),
  ]);

  return { total, page: opts.page, limit: opts.limit, itens };
}

export async function trabalhosPorAno() {
  const grupos = await prisma.work.groupBy({
    by: ["year"],
    _count: { _all: true },
    orderBy: { year: "asc" },
  });
  return grupos.map((g) => ({ ano: g.year, total: g._count._all }));
}

export async function instituicoesPorPais() {
  const grupos = await prisma.institution.groupBy({
    by: ["countryCode"],
    _count: { _all: true },
    orderBy: { _count: { countryCode: "desc" } },
  });
  return grupos.map((g) => ({ pais: g.countryCode ?? "NULL", instituicoes: g._count._all }));
}