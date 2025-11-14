import { BodyShort } from "@navikt/ds-react";
import { useFormContext } from "@rvf/react";
import { useEffect } from "react";
import { Fragment } from "react/jsx-runtime";
import { FormattertTallTextField } from "~/components/ui/FormattertTallTextField";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import type { BarnebidragSkjema } from "../schema";
import { BarnepassPerBarn } from "./BarnepassPerBarn";

export const Barnepass = () => {
  const form = useFormContext<BarnebidragSkjema>();
  const { t } = useOversettelse();
  const barn = form.value("barn");
  const bidragstype = form.value("bidragstype");
  const erBM = bidragstype === "MOTTAKER" || bidragstype === "BEGGE";
  const antallAndreBarn = Number(form.value("andreBarnUnder12.antall")) || 0;
  const tilsynsutgifter = form.value("andreBarnUnder12.tilsynsutgifter") || [];
  // Sjekk om noen barn har barnepassutgifter
  const harBarnepassutgifter = barn.some(
    (b) => b.barnetilsynsutgift.trim() !== "",
  );

  // Synkroniser tilsynsutgifter-arrayen med antall andre barn
  useEffect(() => {
    const nåværendeTilsynsutgifter =
      form.value("andreBarnUnder12.tilsynsutgifter") || [];
    if (nåværendeTilsynsutgifter.length !== antallAndreBarn) {
      const newArray = Array.from({ length: antallAndreBarn }, (_, i) =>
        i < nåværendeTilsynsutgifter.length ? nåværendeTilsynsutgifter[i] : "",
      );
      form.setValue("andreBarnUnder12.tilsynsutgifter", newArray);
    }
  }, [antallAndreBarn, form]);

  if (!erBM) {
    return null;
  }

  return (
    <div className="border p-6 rounded-lg bg-white space-y-6">
      <h2 className="sr-only">{t(tekster.overskrift)}</h2>
      <fieldset className="p-0">
        <legend className="text-xl mb-2">{t(tekster.overskrift)}</legend>
        <BodyShort size="medium" textColor="subtle" spacing>
          {t(tekster.beskrivelse)}
        </BodyShort>
        {barn.map((_, index) => (
          <Fragment key={index}>
            <BarnepassPerBarn barnIndex={index} />
            {index !== barn.length - 1 && (
              <hr className="my-8 border-gray-300" />
            )}
          </Fragment>
        ))}

        {erBM && harBarnepassutgifter && (
          <>
            <hr className="my-8 border-gray-300" />

            <div className="space-y-4">
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

                  {tilsynsutgifter.map((_, index) => (
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
    nb: "Barnepass inkluderer barnehage (uten penger til kost, bleier og lignende), skolefritidsordning (SFO), Aktivitetsskolen (AKS) eller dagmamma. Kostnader for barnepass kalles også tilsynsutgifter.",
    en: "Childcare includes kindergarten (excluding expenses for food, diapers etc), after-school program (SFO), the Activity School (AKS) or nanny. Childcare costs are also referred to as supervision expenses.",
    nn: "Barnepass inkluderer barnehage (utan pengar til kost, bleier og liknande), skulefritidsordning (SFO), Aktivitetsskolen (AKS) eller dagmamma. Kostnadar for barnepass blir óg kalla tilsynsutgifter.",
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
});
