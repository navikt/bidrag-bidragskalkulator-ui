import { z } from "zod";

export const ApplikasjonssideSchema = z.enum([
  "kalkulator",
  "privat-avtale",
  "oversikt",
]);

export type Applikasjonsside = z.infer<typeof ApplikasjonssideSchema>;
