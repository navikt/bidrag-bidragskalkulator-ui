import { z } from "zod";

const envSchema = z.object({
  SERVER_URL: z.string().url().describe("URL til APIet vårt"),
  ENVIRONMENT: z.enum(["dev", "prod"]).describe("Dev for Q-miljøet og prod"),
  UMAMI_WEBSITE_ID: z
    .string()
    .describe("ID for umami (sporingsverktøyet vårt)"),
  INGRESS: z.string().url().describe("Hvilken URL tjenesten kjører på"),
  BIDRAG_BIDRAGSKALKULATOR_TOKEN: z.string().describe("Token for å kalle bidragskalkulator apier"),
});

const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  console.error(
    "❌ Manglende eller ugyldige miljøvariabler:",
    envParse.error.format()
  );
  throw new Error("Ugyldige miljøvariabler");
}

export const env = envParse.data;
