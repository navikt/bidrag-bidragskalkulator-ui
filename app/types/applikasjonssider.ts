import { z } from "zod";

export const ApplikasjonssiderSchema = z.enum([
  "kalkulator",
  "privat-avtale",
  "oversikt",
]);

export type Applikasjonssider = z.infer<typeof ApplikasjonssiderSchema>;
