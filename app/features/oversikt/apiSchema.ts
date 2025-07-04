import { z } from "zod";

const JournalpostPartSchema = z.object({
  navn: z.string(),
});

const DokumentSchema = z.object({
  dokumentInfoId: z.string(),
  tittel: z.string(),
  kanÅpnes: z.boolean(),
});

const JournalpostSchema = z.object({
  journalpostId: z.string(),
  tittel: z.string(),
  dato: z.string(), // Dato som string i ISO-format
  mottaker: JournalpostPartSchema.nullable(),
  avsender: JournalpostPartSchema.nullable(),
  dokumenter: z.array(DokumentSchema),
});

export const MineDokumenterReponsSchema = z.object({
  journalposter: z.array(JournalpostSchema),
});

export type Part = z.infer<typeof JournalpostPartSchema>;
export type Dokument = z.infer<typeof DokumentSchema>;
export type Journalpost = z.infer<typeof JournalpostSchema>;
export type MineDokumenterRespons = z.infer<typeof MineDokumenterReponsSchema>;
