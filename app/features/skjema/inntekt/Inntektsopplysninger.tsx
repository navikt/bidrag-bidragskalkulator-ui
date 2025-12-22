import { BodyLong, BodyShort, ReadMore } from "@navikt/ds-react";
import { useFieldArray, useFormContext, useFormScope } from "@rvf/react";
import { FormattertTallTextField } from "~/components/ui/FormattertTallTextField";
import JaNeiRadio from "~/components/ui/JaNeiRadio";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import BarnEgenInntekt from "../BarnEgenInntekt";
import type { BarnebidragSkjema } from "../schema";
import { sporKalkulatorSpørsmålBesvart } from "../utils";
import Kapitalinntekt from "./Kapitalinntekt";

export const Inntektsopplysninger = () => {
  const form = useFormContext<BarnebidragSkjema>();
  const barn = form.value("barn");
  const barnArray = useFieldArray(form.scope("barn"));
  const barnHarEgenInntekt = useFormScope(
    form.scope("barnHarEgenInntekt"),
  ).value();
  const harGyldigeBarn = barn.filter((b) => b.alder !== "").length > 0;

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
          label={t(tekster.dinInntekt)}
          error={form.field("deg.inntekt").error()}
          onBlur={sporKalkulatorSpørsmålBesvart(
            "deg-inntekt",
            t(tekster.dinInntekt),
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

        <div>
          <Kapitalinntekt part="deg" />
          <Kapitalinntekt part="medforelder" />
        </div>

        {harGyldigeBarn && (
          <>
            <JaNeiRadio
              {...form.field("barnHarEgenInntekt").getInputProps()}
              legend={t(
                barnArray.length() > 1
                  ? tekster.barnHarEgenInntekt.plural
                  : tekster.barnHarEgenInntekt.singular,
              )}
              error={form.field("barnHarEgenInntekt").error()}
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
    nb: "Hva har du hatt i inntekt de siste 12 månedene?",
    en: "What has your income been in the last 12 months?",
    nn: "Kva har du hatt i inntekt dei siste 12 månadane?",
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
  barnHarEgenInntekt: {
    singular: {
      nb: "Har barnet egen inntekt?",
      en: "Does a child have its own income?",
      nn: "Har barnet eigen inntekt?",
    },
    plural: {
      nb: "Har barna egen inntekt?",
      en: "Do children have their own income?",
      nn: "Har barna eigen inntekt?",
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
      en: (
        <>
          If the child has an annual income over{" "}
          <span style={{ color: "#C30000" }}>60 300 kroner</span>, it will
          affect the calculation. With an income over{" "}
          <span style={{ color: "#C30000" }}>201 000</span>, the child is
          considered self-sufficient. Write 0 if the child has no income.
        </>
      ),
      nn: (
        <>
          Dersom barnet har ei årsinntekt over{" "}
          <span style={{ color: "#C30000" }}>60 300 kroner</span>, vil det
          påverke berekninga i kalkulatoren. Ved inntekt over{" "}
          <span style={{ color: "#C30000" }}>201 000</span> blir barnet rekna
          som sjølvforsørga. Skriv 0 dersom barnet ikkje har inntekt.
        </>
      ),
    },
  },
});
