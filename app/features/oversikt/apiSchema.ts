import { z } from "zod";

// Schema for navn (brukes av både avsender og mottaker)
const JournalpostPartSchema = z.object({
  navn: z.string(),
});

// Schema for dokumenter i en journalpost
const DokumentSchema = z.object({
  dokumentInfoId: z.string(),
  tittel: z.string(),
  kanÅpnes: z.boolean(),
});

// Schema for en journalpost
const JournalpostSchema = z.object({
  journalpostId: z.string(),
  tittel: z.string(),
  dato: z.string(), // Dato som string i ISO-format
  mottaker: JournalpostPartSchema.nullable(),
  avsender: JournalpostPartSchema.nullable(),
  dokumenter: z.array(DokumentSchema),
});

// Schema for responsen som inneholder en liste med journalposter
export const MineDokumenterReponsSchema = z.object({
  journalposter: z.array(JournalpostSchema),
});

// Typescript-typer utledet fra skjemaene
export type Part = z.infer<typeof JournalpostPartSchema>;
export type Dokument = z.infer<typeof DokumentSchema>;
export type Journalpost = z.infer<typeof JournalpostSchema>;
export type MineDokumenterRespons = z.infer<typeof MineDokumenterReponsSchema>;
