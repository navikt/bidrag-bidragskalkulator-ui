import { useFormContext } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { FormattertTallTextField } from "./FormattertTallTextField";

import { BodyLong, ReadMore } from "@navikt/ds-react";
import { sporHendelseEnGang } from "~/utils/analytics";
import type { InnloggetSkjema, ManueltSkjema } from "./schema";
import { sporKalkulatorSpørsmålBesvart } from "./utils";

export const Inntektsopplysninger = () => {
  const form = useFormContext<ManueltSkjema | InnloggetSkjema>();
  const { t } = useOversettelse();

  const medforelderNavnField = form.field("medforelder.navn");
  const medforelderNavn = medforelderNavnField.touched()
    ? medforelderNavnField.value()
    : "";

  return (
    <div className="flex flex-col gap-4">
      <FormattertTallTextField
        {...form.field("deg.inntekt").getControlProps()}
        label={t(tekster.dinInntekt.label)}
        description={t(tekster.dinInntekt.beskrivelse)}
        error={form.field("deg.inntekt").error()}
        onBlur={sporKalkulatorSpørsmålBesvart(t(tekster.dinInntekt.label))}
        htmlSize={18}
      />
      <ReadMore
        header={t(tekster.inntektsinformasjon.overskrift)}
        onOpenChange={(open) => {
          if (open) {
            sporHendelseEnGang({
              hendelsetype: "inntektsinformasjon utvidet",
              skjemaId: "barnebidragskalkulator-under-18",
            });
          }
        }}
      >
        <BodyLong spacing>
          {t(tekster.inntektsinformasjon.beskrivelseDel1)}
        </BodyLong>
        <BodyLong>{t(tekster.inntektsinformasjon.beskrivelseDel2)}</BodyLong>
      </ReadMore>

      <FormattertTallTextField
        {...form.field("medforelder.inntekt").getControlProps()}
        label={t(tekster.hvaErInntektenTilDenAndreForelderen(medforelderNavn))}
        error={form.field("medforelder.inntekt").error()}
        onBlur={sporKalkulatorSpørsmålBesvart(
          t(tekster.hvaErInntektenTilDenAndreForelderen("")),
        )}
        htmlSize={18}
      />
    </div>
  );
};

const tekster = definerTekster({
  dinInntekt: {
    label: {
      nb: "Hva er årsinntekten din?",
      en: "What is your annual income?",
      nn: "Kva er årsinntekta di?",
    },
    beskrivelse: {
      nb: "Inntekten din er hentet fra Skatteetaten, og er all inntekt registrert på deg de siste 12 månedene. Juster tallet hvis det ikke stemmer.",
      en: "Your income is fetched from The Norwegian Tax Administration, and is all income registered on you in the last 12 months. Adjust the amount if it does not match.",
      nn: "Inntekta di er henta frå Skatteetaten, og er all inntekt registrert på deg de siste 12 månedene. Juster tallet hvis det ikke stemmer.",
    },
  },
  inntektsinformasjon: {
    overskrift: {
      nb: "Hva som skal tas med i inntekten din",
      en: "What should be included in your income",
      nn: "Kva som skal takast med i inntekta di",
    },
    beskrivelseDel1: {
      nb: "Inntekten din inkluderer personinntekt og kapitalinntekter over 10\u00A0000 kroner. For bidragsmottakere skal det i tillegg tas med utvidet barnetrygd, ekstra småbarnstillegg og kontantstøtte for bidragsbarnet.",
      en: "Your income includes personal income and capital income over 10,000 NOK. For support recipients, extended child benefit, extra small child supplement, and cash benefit for the support child.",
      nn: "Inntekta di inkluderar personinntekt og kapitalinntekter over 10\u00A0000 kroner. For bidragsmottakarar skal det i tillegg takast med utvida barnetrygd, ekstra småbarnstillegg og kontantstøtte for bidragsbarnet.",
    },
    beskrivelseDel2: {
      nb: "Inntekter som ikke skal oppgis på skattemeldingen, skal ikke tas med i beregningsgrunnlaget, for eksempel skattefrie husleieinntekter.",
      en: "Income that shall not be reported on the tax return shall not be included in the calculation basis, for example tax-exempt rental income.",
      nn: "Inntekter som ikkje skal oppgjevast på skattemeldinga, skal ikkje takast med i utrekningsgrunnlaget, til dømes skattefrie husleigeinntekter.",
    },
  },
  hvaErInntektenTilDenAndreForelderen: (navn) => ({
    nb: `Hva er årsinntekten til ${navn || "den andre forelderen"}?`,
    en: `What is ${navn || "the other parent"}'s annual income?`,
    nn: `Kva er årsinntekta til ${navn || "den andre forelderen"}?`,
  }),
  beregnBarnebidraget: {
    nb: "Beregn barnebidraget",
    en: "Calculate child support",
    nn: "Rekn ut fostringstilskot",
  },
});
