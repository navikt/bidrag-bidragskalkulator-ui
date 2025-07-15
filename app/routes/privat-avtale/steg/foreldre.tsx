import { useNavigate, type MetaArgs } from "react-router";
import { Avtalepart } from "~/features/privatAvtale/Avtalepart";
import { definerTekster, oversett, Språk, useOversettelse } from "~/utils/i18n";

export function meta({ matches }: MetaArgs) {
  const rootData = matches.find((match) => match.pathname === "/")?.data as {
    språk: Språk;
  };

  const språk = rootData?.språk ?? Språk.NorwegianBokmål;

  return [
    { title: oversett(språk, tekster.meta.tittel) },
    {
      name: "description",
      content: oversett(språk, tekster.meta.beskrivelse),
    },
  ];
}

export default function Foreldre() {
  const navigate = useNavigate();
  const { t } = useOversettelse();

  //   const degNavn = useField("deg.fulltNavn");
  //   const degIdent = useField("deg.ident");
  //   const forelderNavn = useField("medforelder.fulltNavn");
  //   const forelderIdent = useField("medforelder.ident");

  return (
    <>
      <Avtalepart part="deg" />
      <Avtalepart part="medforelder" />
    </>
  );
}

const tekster = definerTekster({
  meta: {
    tittel: {
      nb: "Om deg og den andre forelderen",
      en: "About you and the other parent",
      nn: "Om deg og den andre forelderen",
    },
    // TODO
    beskrivelse: {
      nb: "Dette skjemaet kan dere bruke når dere skal inngå privat avtale om barnebidrag for barn under 18 år.",
      en: "This form can be used when you want to make a private agreement on child support for children under 18 years old.",
      nn: "Dette skjemaet kan de bruke når de skal inngå privat avtale om fostringstilskot for barn under 18 år.",
    },
  },
  overskrift: {
    nb: "Om deg og den andre forelderen",
    en: "About you and the other parent",
    nn: "Om deg og den andre forelderen",
  },
  knapp: {
    nesteSteg: {
      nb: "Neste steg",
      en: "Next step",
      nn: "Neste steg",
    },
    forrigeSteg: {
      nb: "Forrige steg",
      en: "Previous step",
      nn: "Førre steg",
    },
  },
});
