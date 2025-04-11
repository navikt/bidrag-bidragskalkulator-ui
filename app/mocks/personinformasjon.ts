import type { PersoninformasjonResponse } from "~/features/personinformasjon/schema";

export const PERSON_MED_EN_MOTPART_TO_BARN: PersoninformasjonResponse = {
  paaloggetPerson: {
    ident: "30458043937",
    fornavn: "Selvtilfreds",
    fulltNavn: "Selvtilfreds Motvind",
    alder: 44,
  },
  barnRelasjon: [
    {
      motpart: {
        ident: "07418021890",
        fornavn: "Vrien",
        fulltNavn: "Vrien Medvind",
        alder: 45,
      },
      fellesBarn: [
        {
          ident: "03422282172",
          fornavn: "Overflødig",
          fulltNavn: "Overflødig Medvind",
          alder: 3,
        },
        {
          ident: "03421682172",
          fornavn: "Smidig",
          fulltNavn: "Smidig Medvind",
          alder: 9,
        },
      ],
    },
    {
      motpart: {
        ident: "07418021890",
        fornavn: "Vrien",
        fulltNavn: "Kødden Medvind",
        alder: 45,
      },
      fellesBarn: [
        {
          ident: "03422282172",
          fornavn: "Uheldig",
          fulltNavn: "Uheldig Medvind",
          alder: 3,
        },
        {
          ident: "03421682172",
          fornavn: "Slitsom",
          fulltNavn: "Slitsom Medvind",
          alder: 9,
        },
      ],
    },
  ],
};
