import type { PersoninformasjonResponse } from "~/features/personinformasjon/schema";

export const PERSON_MED_EN_MOTPART_TO_BARN: PersoninformasjonResponse = {
  påloggetPerson: {
    ident: "08025327080",
    fornavn: "Selvtilfreds",
    fulltNavn: "Selvtilfreds Motvind",
    alder: 44,
  },
  barnRelasjon: [
    {
      motpart: {
        ident: "16482086857",
        fornavn: "Vrien",
        fulltNavn: "Vrien Medvind",
        alder: 45,
      },
      fellesBarn: [
        {
          ident: "03422282173",
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
        ident: "17418021890",
        fornavn: "Kødden",
        fulltNavn: "Kødden Bris",
        alder: 45,
      },
      fellesBarn: [
        {
          ident: "13422282172",
          fornavn: "Uheldig",
          fulltNavn: "Uheldig Bris",
          alder: 3,
        },
        {
          ident: "23421682172",
          fornavn: "Slitsom",
          fulltNavn: "Slitsom Bris",
          alder: 9,
        },
      ],
    },
  ],
};
