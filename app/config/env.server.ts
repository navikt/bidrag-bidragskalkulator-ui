import { z } from "zod";
import { serverLogger } from "~/utils/logger.server";

const baseSchema = z.object({
  SERVER_URL: z.url().describe("URL til APIet vårt"),
  UMAMI_WEBSITE_ID: z
    .string()
    .describe("ID for umami (sporingsverktøyet vårt)"),
  INGRESS: z.url().describe("Hvilken URL tjenesten kjører på"),
  SESSION_SECRET: z.string().describe("Hemmelighet for sesjonscookie"),
  TELEMETRY_URL: z.url().describe("URL for telemetri"),
  UXSIGNALS_ENABLED: z
    .enum(["true", "false"])
    .describe("Er uxsignals widget aktivert?"),
  UXSIGNALS_MODE: z
    .enum(["demo", "production"])
    .describe("Hvilken modus uxsignals widgeten skal bruke"),
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
  const detaljer = JSON.stringify(envParse.error.format());
  serverLogger.error(`Manglende eller ugyldige miljøvariabler: ${detaljer}`);
  throw new Error(`Ugyldige miljøvariabler: ${detaljer}`);
}

export const env = envParse.data;
