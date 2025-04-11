import { Button, Select } from "@navikt/ds-react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "@rvf/react";
import { withZod } from "@rvf/zod";
import { useEffect } from "react";
import { z } from "zod";
import { Slider } from "~/components/ui/slider";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { FormattertTallTextField } from "../form/FormattertTallTextField";
import type { PersoninformasjonResponse } from "../personinformasjon/schema";
import { usePersoninformasjon } from "./usePersoninformasjon";

export function InnloggetBidragsskjema() {
  const personinformasjon = usePersoninformasjon();
  const form = useForm({
    validator,
    defaultValues: {
      motpartIdent:
        personinformasjon.barnRelasjon.length === 1 &&
        personinformasjon.barnRelasjon[0].motpart
          ? personinformasjon.barnRelasjon[0].motpart?.ident ?? ""
          : "",
      barn: [],
      inntektDeg: "",
      inntektMotpart: "",
    },
  });
  const harValgtMotpart = Boolean(form.value("motpartIdent"));
  const { t } = useOversettelse();
  const tekster = definerTekster({
    beregnBarnebidraget: {
      nb: "Beregn barnebidraget",
      en: "Calculate child support",
      nn: "Beregn fostringstilskotet",
    },
  });

  return (
    <FormProvider scope={form.scope()}>
      <form {...form.getFormProps()} className="flex flex-col gap-4">
        <VelgMotpart />
        {harValgtMotpart && <BostedOgSamvær />}
        <Inntektsopplysninger />

        <Button type="submit" loading={form.formState.isSubmitting}>
          {t(tekster.beregnBarnebidraget)}
        </Button>
      </form>
    </FormProvider>
  );
}

/**
 * Dette schemaet er datamodellen vår, som vi kommer til å bruke for tilstandshåndtering i skjemaet.
 */
const FormSchema = z.object({
  motpartIdent: z.string().length(11),
  barn: z.array(
    z.object({
      ident: z.string().length(11),
      bosted: z.enum(["HOS_FORELDER_1", "HOS_FORELDER_2", "DELT_BOSTED", ""]),
      samvær: z.string().optional(),
    })
  ),
  inntektDeg: z.string(),
  inntektMotpart: z.string(),
});
type Form = z.infer<typeof FormSchema>;

const validator = withZod(FormSchema);

const VelgMotpart = () => {
  const personinformasjon = usePersoninformasjon();
  const form = useFormContext<Form>();
  const medforelderIdent = form.value("motpartIdent");
  const { t } = useOversettelse();

  const tekster = definerTekster({
    velgMotpart: {
      label: {
        nb: "Velg medforelder",
        en: "Select co-parent",
        nn: "Velg medforelder",
      },
    },
  });

  // TODO: Fjern dette og sett det i onChange-handleren til Select-komponenten
  useEffect(() => {
    const fellesBarn = personinformasjon.barnRelasjon.find(
      (relasjon) => relasjon.motpart?.ident === medforelderIdent
    )?.fellesBarn;
    if (fellesBarn && fellesBarn.length > 0) {
      form.setValue(
        "barn",
        fellesBarn.map((barn) => ({
          ident: barn.ident,
          bosted: "",
          samvær: "15",
        }))
      );
    }
  }, [personinformasjon, medforelderIdent, form]);

  if (personinformasjon.barnRelasjon.length === 1) {
    return null;
  }

  return (
    <Select
      {...form.getInputProps("motpartIdent")}
      label={t(tekster.velgMotpart.label)}
    >
      {personinformasjon.barnRelasjon.map((relasjon) => (
        <option key={relasjon.motpart?.ident} value={relasjon.motpart?.ident}>
          {relasjon.motpart?.fulltNavn}
        </option>
      ))}
    </Select>
  );
};

const BostedOgSamvær = () => {
  const personinformasjon = usePersoninformasjon();
  const { t } = useOversettelse();
  const form = useFormContext<Form>();
  const motpart = finnMotpartBasertPåIdent(
    form.value("motpartIdent"),
    personinformasjon
  );
  const barnArray = useFieldArray(form.scope("barn"));

  // TODO: Flytt dette ut
  const tekster = definerTekster({
    bosted: {
      label: (navn) => ({
        nb: `Hvor skal ${navn} bo fast?`,
        en: `Where will ${navn} have a permanent address?`,
        nn: `Kvar skal ${navn} bo fast?`,
      }),
      valg: {
        velg: {
          nb: "Velg hvor barnet skal bo",
          en: "Select where the child will live",
          nn: "Velg kvar barnet skal bo",
        },
        hosDeg: {
          nb: "Barnet bor hos deg",
          en: "The child lives with you",
          nn: "Barnet bor hos deg",
        },
        deltBosted: {
          nb: "Vi har avtale om delt bosted",
          en: "We have an agreement on shared custody",
          nn: "Vi har avtale om delt bosted",
        },
        hosDenAndre: (navn) => ({
          nb: `Barnet bor hos ${navn}`,
          en: `The child lives with ${navn}`,
          nn: `Barnet bor hos ${navn}`,
        }),
      },
    },
    samvær: {
      label: {
        nb: "Hvor mye vil barnet være sammen med deg?",
        en: "How much will the child stay with you?",
        nn: "Kor mykje vil barnet være saman med deg?",
      },
      beskrivelse: {
        nb: "Estimer hvor mange netter barnet vil være hos deg i snitt per måned",
        en: "Estimate how many nights the child will stay with you on average per month",
        nn: "Estimer kor mange netter barnet vil være hos deg i snitt per måned",
      },
      netter: (antall) => ({
        nb: `${antall} netter`,
        en: `${antall} nights`,
        nn: `${antall} netter`,
      }),
      enNatt: {
        nb: "1 natt",
        en: "1 night",
        nn: "1 natt",
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
  });

  return (
    <div>
      {barnArray.map((key, barnField) => {
        const barnInfo = finnBarnBasertPåIdent(
          barnField.value("ident"),
          personinformasjon
        );
        const samvær = barnField.field("samvær").value() ?? "15";
        const samværsgradBeskrivelse =
          samvær === "1"
            ? t(tekster.samvær.enNatt)
            : t(tekster.samvær.netter(samvær));

        return (
          <div key={key}>
            <h3 className="font-bold text-xl">{barnInfo?.fulltNavn}</h3>
            <Select
              {...barnField.field("bosted").getInputProps()}
              error={barnField.field("bosted").error()}
              label={t(
                tekster.bosted.label(
                  `${barnInfo?.fornavn} (${barnInfo?.alder})`
                )
              )}
            >
              <option value="" disabled>
                {t(tekster.bosted.valg.velg)}
              </option>
              <option value="HOS_FORELDER_1">
                {t(tekster.bosted.valg.hosDeg)}
              </option>
              <option value="DELT_BOSTED">
                {t(tekster.bosted.valg.deltBosted)}
              </option>
              <option value="HOS_FORELDER_2">
                {t(tekster.bosted.valg.hosDenAndre(motpart?.fornavn ?? ""))}
              </option>
            </Select>
            {["HOS_FORELDER_1", "HOS_FORELDER_2"].includes(
              barnField.field("bosted").value()
            ) && (
              <Slider
                {...barnField.field("samvær").getControlProps()}
                label={t(tekster.samvær.label)}
                description={t(tekster.samvær.beskrivelse)}
                error={barnField.field("samvær").error()}
                min={0}
                max={30}
                step={1}
                list={[
                  {
                    label: t(tekster.samvær.beskrivelser.ingenNetterHosDeg),
                    value: 0,
                  },
                  {
                    label: t(
                      tekster.samvær.beskrivelser.halvpartenAvTidenHosDeg
                    ),
                    value: 15,
                  },
                  {
                    label: t(tekster.samvær.beskrivelser.alleNetterHosDeg),
                    value: 30,
                  },
                ]}
                valueDescription={samværsgradBeskrivelse}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const Inntektsopplysninger = () => {
  const personinformasjon = usePersoninformasjon();
  const form = useFormContext<Form>();
  const { t } = useOversettelse();
  const motpart = finnMotpartBasertPåIdent(
    form.value("motpartIdent"),
    personinformasjon
  );
  const tekster = definerTekster({
    hvaErInntektenDin: {
      nb: "Hva er inntekten din?",
      en: "What is your income?",
      nn: "Kva er inntekta di?",
    },
    hvaErInntektenTilDenAndreForelderen: (navn) => ({
      nb: `Hva er inntekten til ${navn}?`,
      en: `What is ${navn}'s income?`,
      nn: `Kva er inntekta til ${navn}?`,
    }),
    beregnBarnebidraget: {
      nb: "Beregn barnebidraget",
      en: "Calculate child support",
      nn: "Beregn fostringstilskotet",
    },
    hvaErInntektenDinBeskrivelse: {
      nb: "Oppgi all inntekt per år før skatt.",
      en: "Enter all annual income before taxes.",
      nn: "Oppgi all inntekt per år før skatt.",
    },
    hvaErInntektenTilDenAndreForelderenBeskrivelse: {
      nb: "Oppgi all inntekt per år før skatt",
      en: "Enter all annual income before taxes.",
      nn: "Oppgi all inntekt per år før skatt",
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-4">
        <FormattertTallTextField
          {...form.field("inntektDeg").getControlProps()}
          label={t(tekster.hvaErInntektenDin)}
          description={t(tekster.hvaErInntektenDinBeskrivelse)}
          error={form.field("inntektDeg").error()}
          htmlSize={18}
        />
        <FormattertTallTextField
          {...form.field("inntektMotpart").getControlProps()}
          label={t(
            tekster.hvaErInntektenTilDenAndreForelderen(motpart?.fornavn ?? "")
          )}
          description={t(
            tekster.hvaErInntektenTilDenAndreForelderenBeskrivelse
          )}
          error={form.field("inntektMotpart").error()}
          htmlSize={18}
        />
      </div>
    </div>
  );
};

const finnBarnBasertPåIdent = (
  ident: string,
  personinformasjon: PersoninformasjonResponse
) => {
  return personinformasjon.barnRelasjon
    .find((relasjon) => relasjon.motpart?.ident === ident)
    ?.fellesBarn.find((barn) => barn.ident === ident);
};

const finnMotpartBasertPåIdent = (
  ident: string,
  personinformasjon: PersoninformasjonResponse
) => {
  return personinformasjon.barnRelasjon.find(
    (relasjon) => relasjon.motpart?.ident === ident
  )?.motpart;
};
