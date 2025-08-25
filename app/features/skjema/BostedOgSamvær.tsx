import { useFieldArray, useFormContext } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { FormattertTallTextField } from "./FormattertTallTextField";
import { usePersoninformasjon } from "./personinformasjon/usePersoninformasjon";
import { Samvær } from "./samvær/Samvær";
import { MAKS_ALDER_BARNETILSYNSUTGIFT, type InnloggetSkjema } from "./schema";
import { finnBarnBasertPåIdent } from "./utils";

export const BostedOgSamvær = () => {
  const personinformasjon = usePersoninformasjon();
  const { t } = useOversettelse();
  const form = useFormContext<InnloggetSkjema>();

  const barnArray = useFieldArray(form.scope("barn"));

  return (
    <>
      {barnArray.map((key, barnField, index) => {
        const barnInfo = finnBarnBasertPåIdent(
          barnField.value("ident"),
          personinformasjon,
        );

        const alder = barnInfo?.alder ?? "";
        const visSpørsmålOmBarnetilsynsutgift =
          alder !== "" && Number(alder) <= MAKS_ALDER_BARNETILSYNSUTGIFT;

        return (
          <div key={key} className="border p-4 rounded-md space-y-4">
            <h3 className="font-bold text-xl">{`${barnInfo?.fulltNavn} (${barnInfo?.alder})`}</h3>
            <Samvær barnIndex={index} />
            {visSpørsmålOmBarnetilsynsutgift && (
              <FormattertTallTextField
                {...barnField.field("barnetilsynsutgift").getControlProps()}
                label={t(tekster.barnetilsynsutgift.label)}
                description={t(tekster.barnetilsynsutgift.description)}
                htmlSize={18}
                error={barnField.field("barnetilsynsutgift").error()}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

const tekster = definerTekster({
  bosted: {
    label: (navn) => ({
      nb: `Hvor skal ${navn} bo fast?`,
      en: `Where will ${navn} have a permanent address?`,
      nn: `Kvar skal ${navn} bu fast?`,
    }),
    valg: {
      velg: {
        nb: "Velg hvor barnet skal bo",
        en: "Select where the child will live",
        nn: "Velg kvar barnet skal bu",
      },
      DELT_FAST_BOSTED: {
        nb: "Vi har avtale om delt fast bosted",
        en: "We have an agreement on shared custody",
        nn: "Vi har avtale om delt bustad",
      },
      IKKE_DELT_FAST_BOSTED: {
        nb: "Vi har ikke avtale om delt fast bosted",
        en: "The child lives permanently with one of us",
        nn: "Barnet bur fast hos ein av oss",
      },
      hosDenAndre: (navn) => ({
        nb: `Barnet bor hos ${navn}`,
        en: `The child lives with ${navn}`,
        nn: `Barnet bur hos ${navn}`,
      }),
    },
  },
  samvær: {
    label: {
      nb: "Hvor mye vil barnet være sammen med deg?",
      en: "How much will the child stay with you?",
      nn: "Kor mykje vil barnet vere saman med deg?",
    },
    beskrivelse: {
      nb: "Estimer hvor mange netter barnet vil være hos deg i snitt per måned",
      en: "Estimate how many nights the child will stay with you on average per month",
      nn: "Estimer kor mange netter barnet vil vere hos deg i snitt per månad",
    },
    netter: (antall) => ({
      nb: `${antall} netter hos deg`,
      en: `${antall} nights with you`,
      nn: `${antall} netter hos deg`,
    }),
    enNatt: {
      nb: "1 natt hos deg",
      en: "1 night with you",
      nn: "1 natt hos deg",
    },
    beskrivelser: {
      ingenNetterHosDeg: {
        nb: "Ingen netter hos deg",
        en: "No nights with you",
        nn: "Ingen netter hos deg",
      },
      halvpartenAvTidenHosDeg: {
        nb: "Halvparten av nettene hos deg",
        en: "Half the nights with you",
        nn: "Halvparten av nettene hos deg",
      },
      alleNetterHosDeg: {
        nb: "Alle netter hos deg",
        en: "All the nights with you",
        nn: "Alle netter hos deg",
      },
    },
  },
  barnetilsynsutgift: {
    label: {
      nb: "Hva koster barnepass for barnet?",
      en: "What are the child care costs for the child?",
      nn: "Kva kostar barnepass for barnet?",
    },
    description: {
      nb: "Barnepass inkluderer barnehage (uten penger til kost, bleier og lignende), skolefritidsordning (SFO), Aktivitetsskolen (AKS) eller dagmamma",
      en: "Childcare includes kindergarten (excluding expenses for food, diapers etc), after-school program (SFO), the Activity School (AKS) or nanny",
      nn: "Barnepass inkluderer barnehage (uten penger til kost, bleier og lignende), skulefritidsordning (SFO), Aktivitetsskolen (AKS) eller dagmamma",
    },
  },
});
