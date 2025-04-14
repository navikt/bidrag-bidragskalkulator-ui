import { z } from "zod";

const envSchema = z.object({
  SERVER_URL: z.string().url(),
  ENVIRONMENT: z.enum(["dev", "prod"]),
  UMAMI_WEBSITE_ID: z.string(), // TODO: Legg til UUID-validering
  INGRESS: z.string().url(),
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
