import { z } from "zod";

const baseSchema = z.object({
  SERVER_URL: z.string().url().describe("URL til APIet vårt"),
  UMAMI_WEBSITE_ID: z
    .string()
    .describe("ID for umami (sporingsverktøyet vårt)"),
  INGRESS: z.string().url().describe("Hvilken URL tjenesten kjører på"),
  SESSION_SECRET: z.string().describe("Hemmelighet for sesjonscookie"),
});

const localEnvSchema = baseSchema.extend({
  ENVIRONMENT: z.literal("local").describe("Lokalt utviklingsmiljø"),
  BIDRAG_BIDRAGSKALKULATOR_TOKEN: z
    .string()
    .describe("Token for å kalle bidragskalkulator APIene ved lokal utvikling"),
});

const nonLocalEnvSchema = baseSchema.extend({
  ENVIRONMENT: z.enum(["dev", "prod"]).describe("Dev for Q-miljøet og prod"),
});

const envSchema = z.discriminatedUnion("ENVIRONMENT", [
  localEnvSchema,
  nonLocalEnvSchema,
]);

const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  console.error(
    "❌ Manglende eller ugyldige miljøvariabler:",
    envParse.error.format(),
  );
  throw new Error(
    "Ugyldige miljøvariabler: " + envParse.error.format().toString(),
  );
}

export const env = envParse.data;
