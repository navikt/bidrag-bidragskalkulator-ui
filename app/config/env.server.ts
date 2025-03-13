import { z } from "zod";

const envSchema = z.object({
  SERVER_URL: z.string().url(),
  ENVIRONMENT: z.enum(["dev", "prod"]),
});

const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  console.error("❌ Invalid environment variables:", envParse.error.format());
  throw new Error("Invalid environment variables");
}

export const env = envParse.data;
