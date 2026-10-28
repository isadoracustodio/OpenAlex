import { z } from "zod"

const schema = z.object({
    OPENALEX_API_KEY: z.string().min(1, "OPENALEX_API_KEY está vazia no .env"),
    DATABASE_URL: z.string().min(1),
    PORT: z.coerce.number().default(3000),
});

export const env = schema.parse(process.env);

export const UNIMAR_ID = "i4210112693";
export const DATA_DIR = "data";
export const JSONL_PATH = `${DATA_DIR}/trabalhos.jsonl`;