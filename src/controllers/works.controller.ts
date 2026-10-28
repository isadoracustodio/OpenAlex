import type { Request, Response } from "express";
import { z } from "zod";
import * as service from "../services/works.service.js";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  year: z.coerce.number().int().optional(),
});

export async function listar(req: Request, res: Response) {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ erro: "Parâmetros inválidos", detalhes: parsed.error.issues });
  }
  res.json(await service.listarTrabalhos(parsed.data));
}

export async function porAno(_req: Request, res: Response) {
  res.json(await service.trabalhosPorAno());
}

export async function porPais(_req: Request, res: Response) {
  res.json(await service.instituicoesPorPais());
}