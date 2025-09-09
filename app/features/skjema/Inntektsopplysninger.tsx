import { useFormContext } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { FormattertTallTextField } from "../../components/ui/FormattertTallTextField";

import { BodyLong, ReadMore } from "@navikt/ds-react";
import { sporHendelse } from "~/utils/analytics";
import type { BarnebidragSkjema } from "./schema";
import { sporKalkulatorSpørsmålBesvart } from "./utils";

export const Inntektsopplysninger = () => {
  const form = useFormContext<BarnebidragSkjema>();
  const { t } = useOversettelse();

  return (
    <div className="border p-4 rounded-md">
      <h2 className="sr-only">{t(tekster.tittel)}</h2>
      <fieldset className="p-0 flex flex-col gap-4">
        <legend className="text-xl mb-5">{t(tekster.tittel)}</legend>

        <FormattertTallTextField
          {...form.field("deg.inntekt").getControlProps()}
          label={t(tekster.dinInntekt.label)}
          error={form.field("deg.inntekt").error()}
          onBlur={sporKalkulatorSpørsmålBesvart(
            "deg-inntekt",
            t(tekster.dinInntekt.label),
          )}
          htmlSize={18}
        />

        <FormattertTallTextField
          {...form.field("medforelder.inntekt").getControlProps()}
          label={t(tekster.hvaErInntektenTilDenAndreForelderen)}
          error={form.field("medforelder.inntekt").error()}
          onBlur={sporKalkulatorSpørsmålBesvart(
            "medforelder-inntekt",
            t(tekster.hvaErInntektenTilDenAndreForelderen),
          )}
          htmlSize={18}
        />

        <ReadMore
          header={t(tekster.inntektsinformasjon.overskrift)}
          onOpenChange={(open) => {
            if (open) {
              sporHendelse({
                hendelsetype: "les mer utvidet",
                tekst: t(tekster.inntektsinformasjon.overskrift),
                id: "kalkulator-inntekt",
              });
            }
          }}
        >
          <BodyLong spacing>
            {t(tekster.inntektsinformasjon.beskrivelseDel1)}
          </BodyLong>
          <BodyLong spacing>
            {t(tekster.inntektsinformasjon.beskrivelseDel2)}
          </BodyLong>
          <BodyLong>{t(tekster.inntektsinformasjon.beskrivelseDel3)}</BodyLong>
        </ReadMore>
      </fieldset>
    </div>
  );
};

const tekster = definerTekster({
  tittel: {
    nb: "Inntekt",
    en: "Income",
    nn: "Inntekt",
  },
  dinInntekt: {
    label: {
      nb: "Hva har du hatt i inntekt de siste 12 månedene?",
      en: "What has your income been in the last 12 months?",
      nn: "Kva har du hatt i inntekt dei siste 12 månadane?",
    },
  },
  inntektsinformasjon: {
    overskrift: {
      nb: "Hva du skal ta med som inntekt",
      en: "What you should include as income",
      nn: "Kva du skal ta med i inntektene",
    },
    beskrivelseDel1: {
      nb: "Her oppgir du all skattepliktig inntekt de siste 12 månedene. Det er for eksempel lønn, feriepenger, overtidsbetaling, utbetalinger fra Nav, renteinntekter, skattepliktige utleieinntekter eller aksjeinntekter.",
      en: "Income should include all taxable income for the last 12 months. This includes, for example, salary, holiday pay, overtime pay, payments from Nav, interest income, taxable rental income, or share income.",
      nn: "Her oppgir du all skattepliktig inntekt dei siste 12 månadane. Det er til dømes løn, feriepengar, overtidsbetaling, utbetalingar frå Nav, renteinntekter, skattepliktige husleigeinntekter eller aksjeinntekter.",
    },
    beskrivelseDel2: {
      nb: "Utvidet barnetrygd, ekstra småbarnstillegg og kontantstøtte for bidragsbarnet skal også regnes med for den av foreldrene som mottar dette. Dersom dere deler den utvidede barnetrygden, skal begge foreldrene legge det til sin inntekt.",
      en: "Extended child benefit, infant supplement, and cash for care benefit for the support child should be included for the parent who receives this. If you share the extended child benefit, both parents should include it in their income.",
      nn: "Utvida barnetrygd, ekstra småbarnstillegg og kontantstøtte for bidragsbarnet skal takast med for den som har barna mest. Dersom de deler den utvida barnetrygda, skal begge foreldra legge ho til i inntekta si.",
    },
    beskrivelseDel3: {
      nb: "Inntekter som du ikke oppgir i skattemeldingen, skal du ikke ta med her, for eksempel skattefrie husleieinntekter.",
      en: "Income that you do not report in your tax return should not be included here, such as tax-free rental income.",
      nn: "Inntekter som du ikkje oppgir i skattemeldinga, skal du ikkje ta med her, til dømes skattefrie husleigeinntekter.",
    },
  },
  hvaErInntektenTilDenAndreForelderen: {
    nb: "Hva har den andre forelderen hatt i inntekt de siste 12 månedene?",
    en: "What has the other parent's income been in the last 12 months?",
    nn: "Kva har den andre forelderen hatt i inntekt dei siste 12 månadane?",
  },
});
