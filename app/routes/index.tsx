import { BodyLong, Button, Heading } from "@navikt/ds-react";
import type { MetaArgs } from "react-router";
import { Link as ReactRouterLink } from "react-router";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, oversett, Språk, useOversettelse } from "~/utils/i18n";

export function meta({ matches }: MetaArgs) {
  const rootData = matches.find((match) => match.pathname === "/")
    ?.loaderData as {
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

const Landingsside = () => {
  const { t } = useOversettelse();

  return (
    <div className="max-w-xl mx-auto mt-8 mb-16">
      <Heading size="xlarge" level="1" spacing>
        {t(tekster.overskrift)}
      </Heading>

      <BodyLong spacing>{t(tekster.beskrivelse)}</BodyLong>

      <Heading size="large" level="2" spacing>
        {t(tekster.undertittel)}
      </Heading>
      <BodyLong spacing>{t(tekster.beskrivelse1)}</BodyLong>
      <BodyLong spacing>{t(tekster.beskrivelse2)}</BodyLong>
      <div className="flex flex-col gap-4">
        <Button
          as={ReactRouterLink}
          to="/kalkulator"
          className="self-start"
          onClick={() => {
            sporHendelse({
              hendelsetype: "gå til kalkulator klikket",
              kalkulatorversjon: "ny",
            });
          }}
        >
          {t(tekster.lenketekstNyKalkulator)}
        </Button>
        <Button
          as="a"
          href="https://tjenester.nav.no/bidragskalkulator/innledning"
          className="self-start"
          variant="secondary"
          onClick={() => {
            sporHendelse({
              hendelsetype: "gå til kalkulator klikket",
              kalkulatorversjon: "gammel",
            });
          }}
        >
          {t(tekster.lenketekstGammelKalkulator)}
        </Button>
      </div>
    </div>
  );
};

export default Landingsside;

const tekster = definerTekster({
  meta: {
    tittel: {
      nb: "Barnebidragskalkulator",
      en: "Child support calculator",
      nn: "Fostringstilskotskalkulator",
    },
    beskrivelse: {
      nb: "Barnebidragskalkulatoren hjelper deg å regne ut hvor stort et barnebidrag er.",
      en: "The child support calculator helps you calculate how much child support you are entitled to.",
      nn: "Fostringstilskotskalkulatoren hjelper deg å rekne ut hvor stort eit fostringstilskot er.",
    },
  },
  brødsmuler: {
    steg1: {
      label: {
        nb: "Barnebidrag",
        nn: "Fostringstilskot",
        en: "Child support",
      },
      url: {
        nb: "https://www.nav.no/barnebidrag",
        nn: "https://www.nav.no/barnebidrag",
        en: "https://www.nav.no/barnebidrag/en",
      },
    },
    steg2: {
      label: {
        nb: "Kalkulator",
        nn: "Kalkulator",
        en: "Calculator",
      },
      url: {
        nb: "https://www.nav.no/barnebidrag/tjenester/kalkulator",
        nn: "https://www.nav.no/barnebidrag/tjenester/kalkulator",
        en: "https://www.nav.no/barnebidrag/tjenester/kalkulator",
      },
    },
  },
  overskrift: {
    nb: <>Barnebidrags&shy;kalkulator</>,
    en: "Child support calculator",
    nn: <>Fostringstilskots&shy;kalkulator</>,
  },
  beskrivelse: {
    nb: "Barnebidragskalkulatoren hjelper deg å regne ut hva du skal betale eller motta i barnebidrag.",
    en: "The child support calculator helps you calculate how much you should pay or receive in child support.",
    nn: "Fostringstilskotskalkulatoren hjelper deg å rekne ut kva du skal betale eller motta i fostringstilskot.",
  },
  undertittel: {
    nb: "Prøv vår nye kalkulator",
    en: "Try our new calculator",
    nn: "Prøv vår nye kalkulator",
  },
  beskrivelse1: {
    nb: "Vi videreutvikler bidragskalkulatoren for å gjøre den enklere å bruke. Den gamle kalkulatoren er fortsatt tilgjengelig, men vi håper at du vil prøve den nye kalkulatoren og dele erfaringene dine.",
    en: "We are further developing the child support calculator to make it easier to use. The old calculator is still available, but we hope you will try the new calculator and share your experiences.",
    nn: "Vi vidareutviklar fostringstilskotskalkulatoren for å gjere den enklare å bruke. Den gamle kalkulatoren er framleis tilgjengeleg, men vi håper at du vil prøve den nye kalkulatoren og dele erfaringane dine.",
  },
  beskrivelse2: {
    nb: "Hvis den som skal betale barnebidrag også betaler barnebidrag for andre barn, må du bruke den gamle kalkulatoren.",
    en: "If the person required to pay child support is already paying child support for other children, you must use the old calculator.",
    nn: "Dersom den som skal betale barnebidrag allereie betalar barnebidrag for andre barn, må denne kalkulatoren brukast.",
  },
  lenketekstNyKalkulator: {
    nb: "Prøv den nye kalkulatoren",
    en: "Try the new calculator",
    nn: "Prøv den nye kalkulatoren",
  },
  lenketekstGammelKalkulator: {
    nb: "Gå til den gamle kalkulatoren",
    en: "Go to the old calculator",
    nn: "Gå til den gamle kalkulatoren",
  },
});

export const handle = {
  brødsmuler: [tekster.brødsmuler.steg1, tekster.brødsmuler.steg2],
};
