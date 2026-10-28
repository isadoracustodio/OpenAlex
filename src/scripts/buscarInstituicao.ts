import { env } from "@/config/env"

async function main() {
    const url = "https://api.openalex.org/institutions?search=" +
        encodeURIComponent("Universidade de Marília");

    const resposta = await fetch(url, {
        headers: { Authorization: `Bearer ${env.OPENALEX_API_KEY}` },
    });

    console.log(await resposta.json());
}

main();