import { z } from "zod";

const isServer = typeof process !== "undefined";
const miljøvariabler = isServer ? process.env : import.meta.env;

const envSchema = z.object({
  UMAMI_WEBSITE_ID: z.string(),
  ENVIRONMENT: z.enum(["local", "dev", "prod"]),
});

const parsedEnv = envSchema.safeParse(miljøvariabler);
if (!parsedEnv.success) {
  console.error(
    "Ugyldige miljøvariabler definert i Vite-configen",
    parsedEnv.error
  );
  throw new Error(
    "Ugyldige miljøvariabler: " + parsedEnv.error.format().toString()
  );
}

/**
 * Offentlig tilgjengelige miljøvariabler.
 *
 * Disse er tilgjengelige på klientsiden, og skal ikke inneholde sensitiv informasjon.
 */
export const publicEnv = {
  UMAMI_WEBSITE_ID: parsedEnv.data.UMAMI_WEBSITE_ID,
  ENVIRONMENT: parsedEnv.data.ENVIRONMENT,
};
