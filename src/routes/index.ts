import { Router } from "express";
import * as works from "../controllers/works.controller.js";

export const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok" }));
router.get("/works", works.listar);
router.get("/stats/por-ano", works.porAno);
router.get("/stats/por-pais", works.porPais);