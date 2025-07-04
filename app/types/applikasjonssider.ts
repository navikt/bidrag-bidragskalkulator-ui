import { z } from "zod";

export const ApplikasjonssiderSchema = z.enum(["kalkulator", "privat-avtale"]);

export type Applikasjonssider = z.infer<typeof ApplikasjonssiderSchema>;
