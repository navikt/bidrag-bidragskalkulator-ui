import { z } from "zod";

const Person = z.object({
  fodselsnummer: z.string(),
  fornavn: z.string(),
  etternavn: z.string(),
});

const Bidragsbarn = Person.extend({
  sumBidrag: z.number(),
});

export const LagPrivatAvtaleRequestSchema = z.object({
  innhold: z.string(),
  bidragsmottaker: Person,
  bidragspliktig: Person,
  barn: z.array(Bidragsbarn),
  fraDato: z.string(),
  nyAvtale: z.boolean(),
  oppgjorsform: z.enum(["Privat", "Innkreving"]), // TODO Hva skal denne være?
});

export type LagPrivatAvtaleRequest = z.infer<
  typeof LagPrivatAvtaleRequestSchema
>;
