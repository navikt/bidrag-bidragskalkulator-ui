import { useFormContext } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { FormattertTallTextField } from "./FormattertTallTextField";

import { BodyLong, ReadMore } from "@navikt/ds-react";
import type { InnloggetSkjema } from "./schema";

export const Inntektsopplysninger = () => {
  const form = useFormContext<InnloggetSkjema>();
  const { t } = useOversettelse();

  return (
    <div className="flex flex-col gap-4">
      <FormattertTallTextField
        {...form.field("inntektDeg").getControlProps()}
        label={t(tekster.hvaErInntektenDin)}
        description={t(tekster.hvaErInntektenDinBeskrivelse)}
        error={form.field("inntektDeg").error()}
        htmlSize={18}
      />
      <ReadMore header={t(tekster.inntektsinformasjon.overskrift)}>
        <BodyLong>{t(tekster.inntektsinformasjon.beskrivelse)}</BodyLong>
      </ReadMore>

      <FormattertTallTextField
        {...form.field("inntektMotpart").getControlProps()}
        label={t(tekster.hvaErInntektenTilDenAndreForelderen)}
        description={t(tekster.hvaErInntektenTilDenAndreForelderenBeskrivelse)}
        error={form.field("inntektMotpart").error()}
        htmlSize={18}
      />
    </div>
  );
};

const tekster = definerTekster({
  hvaErInntektenDin: {
    nb: "Hva er inntekten din?",
    en: "What is your income?",
    nn: "Kva er inntekta di?",
  },
  inntektsinformasjon: {
    overskrift: {
      nb: "Hva er inkludert i inntekten din?",
      en: "What is included in your income?",
      nn: "Kva er inkludert i inntekta di?",
    },
    beskrivelse: {
      nb: "Inntekten din er all inntekt per år før skatt. Dette inkluderer for eksempel lønn, pensjon, og andre inntekter. Den inkluderer ikke ytelser fra Nav, kapitalinntekt eller arv.",
      en: "Your income is all annual income before taxes. This includes for example salaries, pensions, and other income. It does not include benefits from Nav, capital income or inheritance.",
      nn: "Inntekta di er all inntekt per år før skatt. Dette inkluderer til dømes løner, pensjonar, og andre inntekter. Det inkluderer ikkje ytingar frå Nav, kapitalinntekt eller arv.",
    },
  },
  hvaErInntektenTilDenAndreForelderen: {
    nb: `Hva er inntekten til den andre forelderen?`,
    en: `What is the other parent's income?`,
    nn: `Kva er inntekta til den andre forelderen?`,
  },
  beregnBarnebidraget: {
    nb: "Beregn barnebidraget",
    en: "Calculate child support",
    nn: "Rekn ut fostringstilskot",
  },
  hvaErInntektenDinBeskrivelse: {
    nb: "Inntekten din hentes fra Skatteetaten, og er all inntekt registrert på deg de siste 12 månedene.",
    en: "Your income is fetched from The Norwegian Tax Administration, and is all income registered on you in the last 12 months.",
    nn: "Inntekta di hentes frå Skatteetaten, og er all inntekt registrert på deg de siste 12 månedene.",
  },
  hvaErInntektenTilDenAndreForelderenBeskrivelse: {
    nb: "Oppgi inntekten til den andre forelderen",
    en: "Enter the income of the other parent.",
    nn: "Oppgje inntekten til den andre forelderen",
  },
});
