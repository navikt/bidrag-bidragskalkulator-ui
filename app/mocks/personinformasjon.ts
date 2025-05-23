import type { Personinformasjon } from "~/features/skjema/personinformasjon/schema";

export const PERSON_MED_EN_MOTPART_TO_BARN: Personinformasjon = {
  person: {
    ident: "16478530521",
    fornavn: "Uglesett",
    fulltNavn: "Uglesett Flyvertinne",
  },
  inntekt: 700_000,
  barnerelasjoner: [
    {
      motpart: {
        ident: "07488830028",
        fornavn: "Fysisk",
        fulltNavn: "Fysisk Dagbot",
      },
      fellesBarn: [
        {
          ident: "28521298296",
          fornavn: "Fredelig",
          fulltNavn: "Fredelig Agurk",
          alder: 12,
        },
      ],
    },
    {
      motpart: {
        ident: "13469105800",
        fornavn: "Vennlig",
        fulltNavn: "Vennlig Dagsorden",
      },
      fellesBarn: [
        {
          ident: "03511662574",
          fornavn: "Kul",
          fulltNavn: "Kul Karosseri",
          alder: 8,
        },
        {
          ident: "04442169204",
          fornavn: "Lystig",
          fulltNavn: "Lystig Pedagog",
          alder: 4,
        },
      ],
    },
  ],
};
