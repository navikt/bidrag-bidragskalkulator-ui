import { z } from "zod";

export const PrivatAvtalePersoninformasjonSchema = z.object({
  ident: z.string(),
  fulltNavn: z.string(),
});

const Person = z.object({
  fodselsnummer: z.string(),
  fulltNavn: z.string(),
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
  tilInnsending: z.boolean(),
});

export type LagPrivatAvtaleRequest = z.infer<
  typeof LagPrivatAvtaleRequestSchema
>;

export type HentPersoninformasjonForPrivatAvtaleRespons = z.infer<
  typeof PrivatAvtalePersoninformasjonSchema
>;
