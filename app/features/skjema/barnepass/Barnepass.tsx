import { BodyLong, BodyShort } from "@navikt/ds-react";
import { useField, useFormContext } from "@rvf/react";
import { Fragment } from "react/jsx-runtime";
import { FormattertTallTextField } from "~/components/ui/FormattertTallTextField";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import {
  MAKS_ALDER_BARNETILSYNSUTGIFT,
  type BarnebidragSkjema,
} from "../schema";
import { kalkulerBidragstype } from "../utils";
import { BarnepassPerBarn } from "./BarnepassPerBarn";

export const Barnepass = () => {
  const form = useFormContext<BarnebidragSkjema>();
  const { t } = useOversettelse();
  const barnField = useField(form.scope("barn"));
  const barn = barnField.value() ?? [];

  const bidragstype = form.value("bidragstype");
  const erBM = bidragstype === "MOTTAKER";
  const antallAndreBarn = Number(form.value("andreBarnUnder12.antall")) || 0;

  const dinInntekt = form.value("deg.inntekt");
  const medforelderInntekt = form.value("medforelder.inntekt");

  const barnDuErMottakerFor = barn.filter(
    (enkeltBarn) =>
      enkeltBarn.bosted !== "" &&
      kalkulerBidragstype(
        enkeltBarn.bosted,
        Number(dinInntekt),
        Number(medforelderInntekt),
      ) === "MOTTAKER" &&
      Number(enkeltBarn.alder) <= MAKS_ALDER_BARNETILSYNSUTGIFT,
  );

  const barnDuErPliktigFor = barn.filter(
    (enkeltBarn) =>
      enkeltBarn.bosted !== "" &&
      kalkulerBidragstype(
        enkeltBarn.bosted,
        Number(dinInntekt),
        Number(medforelderInntekt),
      ) === "PLIKTIG" &&
      Number(enkeltBarn.alder) <= MAKS_ALDER_BARNETILSYNSUTGIFT,
  );

  // Sjekk om noen barn har barnepassutgifter
  const harBarnepassutgifter = barn.some(
    (b) => b.barnetilsynsutgift.trim() !== "",
  );

  const finnBarnIndex = (alder: string) => {
    return barn.findIndex((b) => b.alder === alder);
  };

  if (
    (barnDuErMottakerFor.length === 0 && barnDuErPliktigFor.length === 0) ||
    bidragstype === ""
  ) {
    return null;
  }

  return (
    <div className="border p-6 rounded-lg bg-white space-y-6">
      <h2 className="sr-only">{t(tekster.overskrift)}</h2>
      <fieldset className="p-0">
        <legend className="text-xl mb-2">{t(tekster.overskrift)}</legend>
        <BodyLong spacing size="medium" textColor="subtle">
          {t(tekster.beskrivelse)}
        </BodyLong>

        {barnDuErMottakerFor.map((enkeltBarn, index) => {
          return (
            <Fragment key={index}>
              <BarnepassPerBarn
                barnIndex={finnBarnIndex(enkeltBarn.alder)}
                bidragstype="MOTTAKER"
              />
              {index !== barnDuErMottakerFor.length - 1 && (
                <hr className="my-8 border-gray-300" />
              )}
            </Fragment>
          );
        })}

        {barnDuErPliktigFor.map((enkeltBarn, index) => {
          return (
            <Fragment key={index}>
              <BarnepassPerBarn
                barnIndex={finnBarnIndex(enkeltBarn.alder)}
                bidragstype="PLIKTIG"
              />
              {index !== barnDuErPliktigFor.length - 1 && (
                <hr className="my-8 border-gray-300" />
              )}
            </Fragment>
          );
        })}

        {/* Andre barn under 12 år */}
        {erBM && harBarnepassutgifter && (
          <>
            <hr className="my-8 border-gray-300" />
            <div className="space-y-4 mt-8">
              <h3 className="text-lg font-semibold">
                {t(tekster.andreBarnUnder12.overskrift)}
              </h3>

              <FormattertTallTextField
                {...form.field("andreBarnUnder12.antall").getControlProps()}
                label={t(tekster.andreBarnUnder12.antallLabel)}
                description={t(tekster.andreBarnUnder12.antallBeskrivelse)}
                error={form.field("andreBarnUnder12.antall").error()}
                htmlSize={5}
              />

              {antallAndreBarn > 0 && (
                <div className="space-y-3 mt-4">
                  <BodyShort weight="semibold">
                    {t(tekster.andreBarnUnder12.tilsynsutgifterOverskrift)}
                  </BodyShort>
                  <BodyShort size="small" textColor="subtle">
                    {t(tekster.andreBarnUnder12.tilsynsutgifterBeskrivelse)}
                  </BodyShort>

                  {Array.from({ length: antallAndreBarn }, (_, index) => (
                    <FormattertTallTextField
                      key={index}
                      {...form
                        .field(`andreBarnUnder12.tilsynsutgifter[${index}]`)
                        .getControlProps()}
                      label={t(tekster.andreBarnUnder12.barnNummer(index + 1))}
                      error={form
                        .field(`andreBarnUnder12.tilsynsutgifter[${index}]`)
                        .error()}
                      htmlSize={10}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </fieldset>
    </div>
  );
};

const tekster = definerTekster({
  overskrift: {
    nb: "Barnepass",
    en: "Childcare",
    nn: "Barnepass",
  },
  beskrivelse: {
    nb: "Kalkulatoren regner bare med utgifter til barnepass hos den som skal motta barnebidraget. Derfor legges utgifter til barnepass, alltid til mottakerens del av beregningen, uavhengig av hvem som betaler. Utgiften til barnepass er en del av det totale barnebidraget.",
    en: "The calculator only takes into account childcare expenses for the person who will receive the child support. Therefore, childcare expenses are always added to the recipient's part of the calculation, regardless of who pays. The childcare expense is part of the total child support.",
    nn: "Kalkulatoren reknar berre med utgifter til barnepass hjå den som skal motta barnebidraget. Difor blir utgifter til barnepass alltid lagt til mottakaren sin del av berekninga, uavhengig av kven som betaler. Utgifta til barnepass er ein del av det totale barnebidraget.",
  },
  andreBarnUnder12: {
    overskrift: {
      nb: "Andre barn i husstanden",
      en: "Other children in the household",
      nn: "Andre barn i husstanden",
    },
    antallLabel: {
      nb: "Hvor mange andre barn under 12 år bor hos deg?",
      en: "How many other children under 12 live with you?",
      nn: "Kor mange andre barn under 12 år bur hos deg?",
    },
    antallBeskrivelse: {
      nb: "Barn du har lagt inn tidligere i kalkulatoren skal ikke telles med her",
      en: "Children you have previously entered in the calculator should not be counted here",
      nn: "Barn du har lagt inn tidlegare i kalkulatoren skal ikkje teljast med her",
    },
    tilsynsutgifterOverskrift: {
      nb: "Tilsynsutgifter for andre barn",
      en: "Childcare costs for other children",
      nn: "Tilsynsutgifter for andre barn",
    },
    tilsynsutgifterBeskrivelse: {
      nb: "Dersom det betales tilsynsutgifter for barnet/barna, hva utgjør tilsynsutgiften? Skriv 0 dersom det ikke betales tilsynsutgifter.",
      en: "If childcare costs are paid for the child/children, what is the amount? Enter 0 if no childcare costs are paid.",
      nn: "Dersom det blir betalt tilsynsutgifter for barnet/barna, kva utgjer tilsynsutgifta? Skriv 0 dersom det ikkje blir betalt tilsynsutgifter.",
    },
    barnNummer: (nummer) => ({
      nb: `Barn ${nummer}`,
      en: `Child ${nummer}`,
      nn: `Barn ${nummer}`,
    }),
  },
  MOTTAKER: {
    barnepassInformasjon: {
      overskrift: {
        nb: "Betaler den andre forelderen for barnepass?",
        en: "Does the other parent pay for childcare?",
        nn: "Betaler den andre forelderen for barnepass?",
      },
      beskrivelseDel1: {
        nb: "Hvis den andre forelderen betaler for barnepass, legg inn opplysningene slik kalkulatoren ber om. Når kalkulatoren har foreslått et barnebidrag, kan dere for eksempel trekke utgiftene til barnepass  fra forslaget til barnebidrag og justere slik det passer dere.",
        en: "If the other parent pays for childcare, enter the information as the calculator requests. When the calculator has suggested a child support amount, you can, for example, deduct the childcare expenses from the proposed child support and adjust it as it suits you.",
        nn: "Dersom den andre forelderen betaler for barnepass, legg inn opplysningane slik kalkulatoren ber om. Når kalkulatoren har føreslått eit barnebidrag, kan de til dømes trekkje frå utgiftene til barnepass frå forslaget til barnebidrag og justere slik det passar dykk.",
      },
    },
  },
  PLIKTIG: {
    barnepassInformasjon: {
      overskrift: {
        nb: "Betaler du for barnepass?",
        en: "Do you pay for childcare?",
        nn: "Betaler du for barnepass?",
      },
      beskrivelseDel1: {
        nb: "Hvis du betaler for barnepass, legg inn opplysningene slik kalkulatoren ber om. Når kalkulatoren har foreslått et barnebidrag, kan dere for eksempel trekke utgiftene til barnepass  fra forslaget til barnebidrag og justere slik det passer dere.",
        en: "If you pay for childcare, enter the information as the calculator requests. When the calculator has suggested a child support amount, you can, for example, deduct the childcare expenses from the proposed child support and adjust it as it suits you.",
        nn: "Dersom du betaler for barnepass, legg inn opplysningane slik kalkulatoren ber om. Når kalkulatoren har føreslått eit barnebidrag, kan de til dømes trekkje frå utgiftene til barnepass frå forslaget til barnebidrag og justere slik det passar dykk.",
      },
    },
  },
});
