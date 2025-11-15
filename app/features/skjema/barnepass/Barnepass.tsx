import {
  CheckmarkCircleIcon,
  ExclamationmarkTriangleIcon,
} from "@navikt/aksel-icons";
import { Accordion, BodyShort, Tag } from "@navikt/ds-react";
import { useFormContext } from "@rvf/react";
import { useEffect } from "react";
import { FormattertTallTextField } from "~/components/ui/FormattertTallTextField";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import type { BarnebidragSkjema } from "../schema";
import { BarnepassPerBarn } from "./BarnepassPerBarn";

type BarnStatus =
  | "komplett"
  | "ufullstendig"
  | "ikke-startet"
  | "ikke-relevant";

function beregnBarnStatus(barn: BarnebidragSkjema["barn"][0]): BarnStatus {
  const { barnepassSituasjon, barnetilsynsutgift } = barn;

  if (barnepassSituasjon === "") {
    return "ikke-startet";
  }

  if (
    barnepassSituasjon.trim() !== "" &&
    barnepassSituasjon !== "BETALER_SELV"
  ) {
    return "komplett";
  }

  if (
    barnepassSituasjon === "BETALER_SELV" &&
    barnetilsynsutgift.trim() === ""
  ) {
    return "ufullstendig";
  }

  if (
    barnepassSituasjon === "BETALER_SELV" &&
    barnetilsynsutgift.trim() !== ""
  ) {
    return "komplett";
  }

  return "ikke-startet";
}

interface StatusIndikatorProps {
  status: BarnStatus;
}

const StatusIndikator = ({ status }: StatusIndikatorProps) => {
  const { t } = useOversettelse();

  switch (status) {
    case "komplett":
      return (
        <Tag variant="success" size="small" className="ml-3">
          <CheckmarkCircleIcon aria-hidden />
          {t(tekster.status.komplett)}
        </Tag>
      );
    case "ufullstendig":
      return (
        <Tag variant="warning" size="small" className="ml-3">
          <ExclamationmarkTriangleIcon aria-hidden />
          {t(tekster.status.ufullstendig)}
        </Tag>
      );
    case "ikke-relevant":
      return (
        <Tag variant="neutral" size="small" className="ml-3">
          {t(tekster.status.ikkeRelevant)}
        </Tag>
      );
    case "ikke-startet":
    default:
      return (
        <Tag variant="info" size="small" className="ml-3">
          {t(tekster.status.ikkeStartet)}
        </Tag>
      );
  }
};

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

  // Filtrer barn som skal ha barnepass-spørsmål (≤ 10 år)
  const barnMedBarnepass = barn.filter((b) => {
    const alder = Number(b.alder);
    return !isNaN(alder) && alder <= 10;
  });

  if (barnMedBarnepass.length === 0) {
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

        <Accordion>
          {barnMedBarnepass.map((_, index) => {
            const barnIndex = barn.findIndex(
              (b) => b === barnMedBarnepass[index],
            );
            const alder = barn[barnIndex].alder;
            const status = beregnBarnStatus(barn[barnIndex]);

            return (
              <Accordion.Item key={barnIndex} defaultOpen={index === 0}>
                <Accordion.Header className="w-full">
                  <span className="font-semibold">
                    {t(tekster.barn)}{" "}
                    {alder ? `${alder} ${t(tekster.år)}` : barnIndex + 1}
                  </span>
                  <StatusIndikator status={status} />
                </Accordion.Header>
                <Accordion.Content>
                  <BarnepassPerBarn barnIndex={barnIndex} />
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </Accordion>

        {/* Andre barn under 12 år */}
        {erBM && harBarnepassutgifter && (
          <>
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
  barn: {
    nb: "Barn",
    en: "Child",
    nn: "Barn",
  },
  år: {
    nb: "år",
    en: "years",
    nn: "år",
  },
  status: {
    komplett: {
      nb: "Ferdig",
      en: "Complete",
      nn: "Ferdig",
    },
    ufullstendig: {
      nb: "Ufullstendig",
      en: "Incomplete",
      nn: "Ufullstendig",
    },
    ikkeRelevant: {
      nb: "Ikke relevant",
      en: "Not relevant",
      nn: "Ikkje relevant",
    },
    ikkeStartet: {
      nb: "Ikke startet",
      en: "Not started",
      nn: "Ikkje starta",
    },
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
