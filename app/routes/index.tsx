import { BodyLong, Button, Heading, List, ReadMore } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
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

      <section className="mb-7">
        <Heading size="large" level="2" spacing>
          {t(tekster.undertittel)}
        </Heading>
        <BodyLong spacing>{t(tekster.beskrivelse1)}</BodyLong>

        <BodyLong>{t(tekster.brukGammelKalkulator.overskrift)}</BodyLong>
        <List className="mb-7">
          <ListItem>{t(tekster.brukGammelKalkulator.situasjon1)}</ListItem>
          <ListItem>{t(tekster.brukGammelKalkulator.situasjon2)}</ListItem>
        </List>
        <div className="flex flex-col gap-4">
          <Button
            as={ReactRouterLink}
            to="/kalkulator"
            role="link"
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
      </section>

      <section>
        <Heading size="medium" level="3" spacing>
          {t(tekster.personopplysninger.overskrift)}
        </Heading>
        <BodyLong spacing>{t(tekster.personopplysninger.beskrivelse)}</BodyLong>
        <ReadMore
          header={t(tekster.personopplysninger.lesMer.tittel)}
          onClick={(open) => {
            if (open) {
              sporHendelse({
                hendelsetype: "les mer utvidet",
                tekst: t(tekster.personopplysninger.lesMer.tittel),
                id: "kalkulator-personopplysninger",
              });
            }
          }}
        >
          {t(tekster.personopplysninger.lesMer.beskrivelse)}
          <List>
            <List.Item>
              {t(tekster.personopplysninger.lesMer.listepunkter.alder)}
            </List.Item>
            <List.Item>
              {t(tekster.personopplysninger.lesMer.listepunkter.bosituasjon)}
            </List.Item>
            <List.Item>
              {t(tekster.personopplysninger.lesMer.listepunkter.samvær)}
            </List.Item>
            <List.Item>
              {t(
                tekster.personopplysninger.lesMer.listepunkter
                  .andreVoksneOgBarn,
              )}
            </List.Item>
            <List.Item>
              {t(tekster.personopplysninger.lesMer.listepunkter.inntekt)}
            </List.Item>
          </List>
        </ReadMore>
      </section>
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
      nb: "Barnebidragskalkulatoren hjelper deg å regne ut hva du skal betale eller motta i barnebidrag.",
      en: "The child support calculator helps you calculate how much you should pay or receive in child support.",
      nn: "Fostringstilskotskalkulatoren hjelper deg å rekne ut kva du skal betale eller motta i fostringstilskot.",
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
        nb: "https://www.nav.no/barnebidrag/tjenester",
        nn: "https://www.nav.no/barnebidrag/tjenester",
        en: "https://www.nav.no/barnebidrag/tjenester",
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
    nn: "Vi vidareutviklar fostringstilskotskalkulatoren for å gjere den enklare å bruke. Den gamle kalkulatoren er framleis tilgjengeleg, men vi håpar at du vil prøve den nye kalkulatoren og dele erfaringane dine.",
  },
  brukGammelKalkulator: {
    overskrift: {
      nb: "I noen tilfeller bør du likevel bruke den gamle kalkulatoren:",
      en: "In some situations, you should still use the old calculator:",
      nn: "I nokre tilfelle bør du likevel bruke den gamle kalkulatoren:",
    },
    situasjon1: {
      nb: "hvis den som skal betale barnebidrag, også betaler barnebidrag for andre barn",
      en: "if the parent who is to pay child support also pays child support for other children",
      nn: "viss den som skal betale fostringstilskot, også betalar fostringstilskot for andre barn",
    },
    situasjon2: {
      nb: "hvis du ønsker å sjekke om du bør søke endring på barnebidrag som allerede er bestemt (fastsatt) av Nav",
      en: "if you want to check whether you should apply for a change in child support that has already been determined by Nav",
      nn: "dersom du ønsker å sjekke om du bør søke endring på fostringstilskot som allereie er bestemt (fastsett) av Nav",
    },
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
  personopplysninger: {
    overskrift: {
      nb: "Personopplysninger i den nye kalkulatoren",
      en: "Personal information in the new calculator",
      nn: "Personopplysingar i den nye kalkulatoren",
    },
    beskrivelse: {
      nb: "I den nye kalkulatoren er det du som må legge inn opplysninger for å finne ut hva barnebidraget kan være. Vi lagrer ingen opplysninger om deg, og det du legger inn av informasjon, kan ikke spores tilbake til deg.",
      en: "In the new calculator, you must enter information to find out what the child support amount may be. We do not store any information about you, and the information you enter cannot be traced back to you.",
      nn: "I den nye kalkulatoren er det du som må legge inn opplysingar for å finne ut kva fostringstilskotet kan vere. Vi lagrar ingen opplysingar om deg, og det du legg inn av informasjon, kan ikkje sporast tilbake til deg.",
    },
    lesMer: {
      tittel: {
        nb: "Hva vi spør om i den nye kalkulatoren",
        en: "What information we ask for in the new calculator",
        nn: "Kva vi spør om i den nye kalkulatoren",
      },
      beskrivelse: {
        nb: "For å komme frem til en bidragssum, må du legge inn denne informasjonen:",
        en: "To arrive at a child support amount, you must enter this information:",
        nn: "For å kome fram til ein bidragssum, må du legge inn denne informasjonen:",
      },
      listepunkter: {
        alder: {
          nb: "alderen til barnet ditt",
          en: "the age of your child",
          nn: "alderen til barnet ditt",
        },
        bosituasjon: {
          nb: "barnets bosituasjon",
          en: "the child's living situation",
          nn: "busituasjonen til barnet",
        },
        samvær: {
          nb: "hvor mye samvær barnet har med dere som foreldre",
          en: "how much contact the child has with you as parents",
          nn: "kor mykje samvær barnet har med dykk som foreldre",
        },
        andreVoksneOgBarn: {
          nb: "bosituasjon med andre voksne og barn for deg og den andre forelderen",
          en: "living situation with other adults and children for you and the other parent",
          nn: "om du og den andre forelderen bur med andre vaksne og barn",
        },
        inntekt: {
          nb: "din og den andre forelderens inntekt",
          en: "your and the other parent's income",
          nn: "inntekta til deg og den andre forelderen",
        },
      },
    },
  },
});

export const handle = {
  brødsmuler: [tekster.brødsmuler.steg1, tekster.brødsmuler.steg2],
};
