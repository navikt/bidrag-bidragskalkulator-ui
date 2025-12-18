import { useFieldArray, useFormContext, useFormScope } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { FormattertTallTextField } from "../../components/ui/FormattertTallTextField";

import {
  BodyLong,
  BodyShort,
  Checkbox,
  CheckboxGroup,
  ReadMore,
} from "@navikt/ds-react";
import JaNeiRadio from "~/components/ui/JaNeiRadio";
import BarnEgenInntekt from "~/features/skjema/BarnEgenInntekt";
import { sporHendelse } from "~/utils/analytics";
import type { BarnebidragSkjema } from "./schema";
import { sporKalkulatorSpørsmålBesvart } from "./utils";

export const Inntektsopplysninger = () => {
  const form = useFormContext<BarnebidragSkjema>();
  const barn = form.value("barn");
  const barnArray = useFieldArray(form.scope("barn"));
  const barnHarEgenInntekt = useFormScope(
    form.scope("inntekt.barnHarEgenInntekt"),
  ).value();
  const harGyldigeBarn = barn.filter((b) => b.alder !== "").length > 0;
  const harKapitalinntektOver10k = form.value("inntekt.kapitalinntektOver10k");

  const { t } = useOversettelse();

  return (
    <div className="border p-4 rounded-md">
      <h2 className="sr-only">{t(tekster.tittel)}</h2>
      <fieldset className="p-0 flex flex-col gap-4">
        <legend className="text-xl mb-5">{t(tekster.tittel)}</legend>

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

        <CheckboxGroup
          {...form.field("inntekt.kapitalinntektOver10k").getControlProps()}
          legend={t(tekster.kapitalinntektOver10k.legend)}
          hideLegend
          error={form.field("inntekt.kapitalinntektOver10k").error()}
          value={
            form.value("inntekt.kapitalinntektOver10k") === "true"
              ? ["true"]
              : []
          }
          onChange={(value) =>
            form.setValue(
              "inntekt.kapitalinntektOver10k",
              value.includes("true") ? "true" : "",
            )
          }
        >
          <Checkbox value="true">
            {t(tekster.kapitalinntektOver10k.label)}
          </Checkbox>
        </CheckboxGroup>

        {harKapitalinntektOver10k === "true" && (
          <>
            <FormattertTallTextField
              {...form.field("deg.kapitalinntekt").getControlProps()}
              className="pl-8"
              label={t(tekster.kapitalinntekt.din)}
              error={form.field("deg.kapitalinntekt").error()}
              htmlSize={18}
            />
            <FormattertTallTextField
              {...form.field("medforelder.kapitalinntekt").getControlProps()}
              className="pl-8"
              label={t(tekster.kapitalinntekt.medforelder)}
              error={form.field("medforelder.kapitalinntekt").error()}
              htmlSize={18}
            />
          </>
        )}

        {harGyldigeBarn && (
          <>
            <JaNeiRadio
              {...form.field("inntekt.barnHarEgenInntekt").getInputProps()}
              legend={t(
                barnArray.length() > 1
                  ? tekster.barnHarEgenInntekt.plural
                  : tekster.barnHarEgenInntekt.singular,
              )}
              error={form.field("inntekt.barnHarEgenInntekt").error()}
            />

            {barnHarEgenInntekt === "true" && (
              <>
                <BodyShort className="navds-form-field__description">
                  {t(tekster.barnHarEgenInntekt.beskrivelse)}
                </BodyShort>
                {barnArray.map((key, _, index) => (
                  <BarnEgenInntekt key={key} barnIndex={index} />
                ))}
              </>
            )}
          </>
        )}
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
      nb: "Har du renteinntekter, skattepliktige utleieinntekter eller aksjeinntekter skal det føres opp i feltet for netto kapitalinntekter under.",
      en: "If you have interest income, taxable rental income, or share income, it should be entered in the field for net capital income below.",
      nn: "Har du renteinntekter, skattepliktige husleigeinntekter eller aksjeinntekter skal det førast opp i feltet for netto kapitalinntekter under.",
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
  kapitalinntektOver10k: {
    legend: {
      nb: "Har du eller den andre forelderen positiv netto kapitalinntekt over 10 000 kroner per år?",
      en: "Do you or the other parent have positive net capital income of over NOK 10,000 per year?",
      nn: "Har du eller den andre forelderen positiv netto kapitalinntekt over 10 000 kroner per år?",
    },
    label: {
      nb: "Kryss av hvis du eller den andre forelderen har positiv netto kapitalinntekt over 10 000 kroner per år",
      en: "Check if you or the other parent has positive net capital income of over NOK 10,000 per year",
      nn: "Kryss av hvis du eller den andre forelderen har positiv netto kapitalinntekt over 10 000 kroner per år",
    },
  },
  kapitalinntekt: {
    din: {
      nb: "Hva er din netto positive kapitalinntekt per år?",
      en: "What is your net positive capital income per year?",
      nn: "Hva er din netto positive kapitalinntekt per år?",
    },
    medforelder: {
      nb: "Hva er den andre forelderen sin netto positive kapitalinntekt per år?",
      en: "What is the other parent's net positive capital income per year?",
      nn: "Hva er den andre forelderen sin netto positive kapitalinntekt per år?",
    },
  },
  barnHarEgenInntekt: {
    singular: {
      nb: "Har barnet egen inntekt?",
      en: "Does a child have its own income?",
      nn: "",
    },
    plural: {
      nb: "Har barna egen inntekt?",
      en: "Do children have their own income?",
      nn: "",
    },
    beskrivelse: {
      nb: (
        <>
          Hvis barnet har en årsinntekt over{" "}
          <span style={{ color: "#C30000" }}>60 300 kroner</span>, vil det
          påvirke beregningen i kalkulatoren. Ved inntekt over{" "}
          <span style={{ color: "#C30000" }}>201 000</span> regnes barnet som
          selvforsørget. Skriv 0 hvis barnet ikke har inntekt.
        </>
      ),
      en: "",
      nn: "",
    },
  },
});
