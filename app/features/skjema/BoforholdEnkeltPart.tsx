import { useFormContext } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { FormattertTallTextField } from "../../components/ui/FormattertTallTextField";

import { Radio, RadioGroup, Stack } from "@navikt/ds-react";
import { sporHendelse } from "~/utils/analytics";
import { BorMedAnnenVoksenTypeSchema, type BarnebidragSkjema } from "./schema";
import { sporKalkulatorSpørsmålBesvart } from "./utils";

const JA_NEI_ALTERNATIVER = ["true", "false"] as const;

type Props = {
  part: "deg" | "medforelder";
};

export const BoforholdEnkeltPart = ({ part }: Props) => {
  const form = useFormContext<BarnebidragSkjema>();
  const { t } = useOversettelse();

  const skjemagruppe =
    part === "deg" ? "dittBoforhold" : "medforelderBoforhold";

  const borMedAndreBarn =
    form.field(`${skjemagruppe}.borMedAndreBarn`).value() === "true";

  const borMedAnnenVoksen =
    form.field(`${skjemagruppe}.borMedAnnenVoksen`).value() === "true";

  const borMedEgneBarnOver18 =
    form.field(`${skjemagruppe}.borMedAnnenVoksenType`).value() ===
    "EGNE_BARN_OVER_18";

  const borMedBarnVgs =
    form.field(`${skjemagruppe}.borMedBarnOver18`).value() === "true";

  const harAlleredeBarnebidrag =
    form.field(`${skjemagruppe}.betalerBarnebidrageForAndreBarn`).value() ===
    "true";

  const vedEndreBorMedAndreBarn = (value: string) => {
    if (value === "false") {
      form.resetField(`${skjemagruppe}.antallBarnBorFast`);
    }
  };

  return (
    <fieldset className="p-0 flex flex-col gap-4">
      <legend className="sr-only">{t(tekster[skjemagruppe].tittel)}</legend>

      <RadioGroup
        {...form.field(`${skjemagruppe}.borMedAndreBarn`).getInputProps({
          onChange: vedEndreBorMedAndreBarn,
          legend: t(tekster[skjemagruppe].borMedAndreBarn.label),
          error: form.field(`${skjemagruppe}.borMedAndreBarn`).error(),
          children: (
            <Stack
              gap="0 6"
              direction={{ xs: "column", sm: "row" }}
              wrap={false}
            >
              {JA_NEI_ALTERNATIVER.map((alternativ) => {
                return (
                  <Radio
                    value={alternativ}
                    key={alternativ}
                    onChange={() => {
                      sporHendelse({
                        hendelsetype: "skjema spørsmål besvart",
                        skjemaId: "barnebidragskalkulator-under-18",
                        spørsmålId: `${part}-bor-med-andre-barn`,
                        spørsmål: t(
                          tekster[skjemagruppe].borMedAndreBarn.label,
                        ),
                        svar: tekster.felles.jaNei[alternativ].nb,
                      });
                    }}
                  >
                    {t(tekster.felles.jaNei[alternativ])}
                  </Radio>
                );
              })}
            </Stack>
          ),
        })}
      />

      {borMedAndreBarn && (
        <>
          <FormattertTallTextField
            {...form
              .field(`${skjemagruppe}.antallBarnBorFast`)
              .getControlProps()}
            label={t(tekster[skjemagruppe].antallBarnBorFast.label)}
            error={form.field(`${skjemagruppe}.antallBarnBorFast`).error()}
            description={t(tekster[skjemagruppe].antallBarnBorFast.beskrivelse)}
            onBlur={sporKalkulatorSpørsmålBesvart(
              `${part}-antall-barn-bor-fast`,
              t(tekster[skjemagruppe].antallBarnBorFast.label),
            )}
            htmlSize={8}
          />
        </>
      )}

      <RadioGroup
        {...form.field(`${skjemagruppe}.borMedAnnenVoksen`).getInputProps()}
        error={form.field(`${skjemagruppe}.borMedAnnenVoksen`).error()}
        legend={t(tekster[skjemagruppe].borMedAnnenVoksen.label)}
      >
        <Stack gap="0 6" direction={{ xs: "column", sm: "row" }} wrap={false}>
          {JA_NEI_ALTERNATIVER.map((alternativ) => {
            return (
              <Radio
                value={alternativ}
                key={alternativ}
                onChange={sporKalkulatorSpørsmålBesvart(
                  `${part}-bor-med-voksen`,
                  t(tekster[skjemagruppe].borMedAnnenVoksen.label),
                )}
              >
                {t(tekster.felles.jaNei[alternativ])}
              </Radio>
            );
          })}
        </Stack>
      </RadioGroup>

      {borMedAnnenVoksen && (
        <>
          <RadioGroup
            {...form
              .field(`${skjemagruppe}.borMedAnnenVoksenType`)
              .getInputProps()}
            error={form.field(`${skjemagruppe}.borMedAnnenVoksenType`).error()}
            legend={t(tekster[skjemagruppe].borSammenMed.label)}
          >
            {BorMedAnnenVoksenTypeSchema.options.map((alternativ) => {
              return (
                <Radio value={alternativ} key={alternativ}>
                  {t(tekster[skjemagruppe].borMedAnnenVoksenType[alternativ])}
                </Radio>
              );
            })}
          </RadioGroup>

          {borMedEgneBarnOver18 && (
            <>
              <RadioGroup
                {...form
                  .field(`${skjemagruppe}.borMedBarnOver18`)
                  .getInputProps()}
                error={form.field(`${skjemagruppe}.borMedBarnOver18`).error()}
                legend={t(tekster[skjemagruppe].borMedBarnOver18.label)}
              >
                <Stack
                  gap="0 6"
                  direction={{ xs: "column", sm: "row" }}
                  wrap={false}
                >
                  {JA_NEI_ALTERNATIVER.map((alternativ) => {
                    return (
                      <Radio value={alternativ} key={alternativ}>
                        {t(tekster.felles.jaNei[alternativ])}
                      </Radio>
                    );
                  })}
                </Stack>
              </RadioGroup>

              {borMedBarnVgs && (
                <FormattertTallTextField
                  {...form
                    .field(`${skjemagruppe}.antallBarnOver18`)
                    .getControlProps()}
                  label={t(tekster[skjemagruppe].antallBarnOver18.label)}
                  error={form.field(`${skjemagruppe}.antallBarnOver18`).error()}
                  htmlSize={8}
                />
              )}
            </>
          )}
        </>
      )}

      <RadioGroup
        {...form
          .field(`${skjemagruppe}.betalerBarnebidrageForAndreBarn`)
          .getInputProps()}
        error={form
          .field(`${skjemagruppe}.betalerBarnebidrageForAndreBarn`)
          .error()}
        legend={t(tekster[skjemagruppe].barnebidragForAndreEgneBarn.label)}
        description={t(
          tekster[skjemagruppe].barnebidragForAndreEgneBarn.beskrivelse,
        )}
      >
        <Stack gap="0 6" direction={{ xs: "column", sm: "row" }} wrap={false}>
          {JA_NEI_ALTERNATIVER.map((alternativ) => {
            return (
              <Radio
                value={alternativ}
                key={alternativ}
                onChange={sporKalkulatorSpørsmålBesvart(
                  `${part}-bor-med-voksen`,
                  t(tekster[skjemagruppe].borMedAnnenVoksen.label),
                )}
              >
                {t(tekster.felles.jaNei[alternativ])}
              </Radio>
            );
          })}
        </Stack>
      </RadioGroup>

      {harAlleredeBarnebidrag && (
        <FormattertTallTextField
          {...form
            .field(`${skjemagruppe}.andreBarnebidragerPerMåned`)
            .getControlProps()}
          label={t(tekster[skjemagruppe].andreBarnebidragerPerMåned.label)}
          error={form
            .field(`${skjemagruppe}.andreBarnebidragerPerMåned`)
            .error()}
          htmlSize={8}
        />
      )}
    </fieldset>
  );
};

const tekster = definerTekster({
  dittBoforhold: {
    tittel: {
      nb: "Din bosituasjon",
      en: "Your housing situation",
      nn: "Din busituasjon",
    },
    antallBarnBorFast: {
      label: {
        nb: "Hvor mange andre egne barn bor fast hos deg?",
        nn: "",
        en: "",
      },
      beskrivelse: {
        nb: "Barn du har lagt inn tidligere i kalkulatoren, skal ikke telles med her.",
        nn: "Barn du har lagt inn tidlegare i kalkulatoren, skal du ikkje telje med her.",
        en: "Children you have previously entered in the calculator should not be included here.",
      },
    },
    antallBarnDeltBosted: {
      label: {
        nb: "Antall egne barn under 18 år med delt bosted hos deg",
        nn: "Antal eigne barn under 18 år med delt bustad hos deg",
        en: "Number of children of your own under 18 years with shared permanent residence living with you",
      },
      beskrivelse: {
        nb: "Barn du har lagt inn tidligere i kalkulatoren, skal ikke telles med her.",
        nn: "Barn du har lagt inn tidlegare i kalkulatoren, skal du ikkje telje med her.",
        en: "Children you have previously entered in the calculator should not be included here.",
      },
    },
    borMedAnnenVoksen: {
      label: {
        nb: "Bor du sammen med voksne over 18 år?",
        nn: "",
        en: "",
      },
    },
    borMedAndreBarn: {
      label: {
        nb: "Har du andre egne barn under 18 år som bor fast hos deg",
        nn: "",
        en: "",
      },
    },
    barnebidragForAndreEgneBarn: {
      label: {
        nb: "Betaler du barnebidrag for andre egne barn?",
        nn: "",
        en: "",
      },
      beskrivelse: {
        nb: "Dette kan være barn over 18 år, eller samboer/ektefelle",
        nn: "",
        en: "",
      },
    },
    borMedAnnenVoksenType: {
      label: {
        nb: "Hvem bor du sammen med?",
        nn: "",
        en: "",
      },
      SAMBOER_ELLER_EKTEFELLE: {
        nb: "Samboer eller ektefelle",
        nn: "",
        en: "",
      },
      EGNE_BARN_OVER_18: {
        nb: "Egne barn over 18 år",
        nn: "",
        en: "",
      },
    },
    borSammenMed: {
      label: {
        nb: "Hvem bor du sammen med?",
        nn: "",
        en: "",
      },
    },
    borMedBarnOver18: {
      label: {
        nb: "Bor du sammen med egne barn som går på videregående skole?",
        nn: "",
        en: "",
      },
    },
    antallBarnOver18: {
      label: {
        nb: "Antall barn som går på videregående skole",
        nn: "",
        en: "",
      },
    },
    andreBarnebidragerPerMåned: {
      label: {
        nb: "Hvor mye betaler bidragspliktig] totalt i barnebidrag for andre egne barn per måned?",
        nn: "",
        en: "",
      },
    },
  },
  medforelderBoforhold: {
    tittel: {
      nb: "Den andre forelderen sin bosituasjon",
      en: "The other parent's housing situation",
      nn: "bidragspliktig sin busituasjon",
    },
    antallBarnBorFast: {
      label: {
        nb: "Hvor mange andre egne barn bor fast hos bidragspliktig?",
        nn: "",
        en: "",
      },
      beskrivelse: {
        nb: "Barn du har lagt inn tidligere i kalkulatoren, skal ikke telles med her.",
        nn: "Barn du har lagt inn tidlegare i kalkulatoren, skal du ikkje telje med her.",
        en: "Children you have previously entered in the calculator should not be included here.",
      },
    },
    antallBarnDeltBosted: {
      label: {
        nb: "Antall egne barn under 18 år med delt bosted hos bidragspliktig",
        nn: "Antal eigne barn under 18 år med delt bustad hos bidragspliktig",
        en: "Number of own children under 18 years, with shared permanent residence living with the other parent",
      },
      beskrivelse: {
        nb: "Barn du har lagt inn tidligere i kalkulatoren, skal ikke telles med her.",
        nn: "Barn du har lagt inn tidlegare i kalkulatoren, skal du ikkje telje med her.",
        en: "Children you have previously entered in the calculator should not be included here.",
      },
    },
    borMedAnnenVoksen: {
      label: {
        nb: "Bor bidragsplikitig sammen med voksne over 18 år?",
        nn: "",
        en: "",
      },
    },
    borMedAndreBarn: {
      label: {
        nb: "Har bidragspliktig andre egne barn under 18 år som bor fast hos seg?",
        nn: "",
        en: "",
      },
    },
    barnebidragForAndreEgneBarn: {
      label: {
        nb: "Betaler bidragspliktig barnebidrag for andre egne barn?",
        nn: "",
        en: "",
      },
      beskrivelse: {
        nb: "Dette kan være barn over 18 år, eller samboer/ektefelle",
        nn: "",
        en: "",
      },
    },
    borMedAnnenVoksenType: {
      label: {
        nb: "Hvem bor bidragspliktig sammen med?",
        nn: "",
        en: "",
      },
      SAMBOER_ELLER_EKTEFELLE: {
        nb: "Samboer eller ektefelle",
        nn: "",
        en: "",
      },
      EGNE_BARN_OVER_18: {
        nb: "Egne barn over 18 år",
        nn: "",
        en: "",
      },
    },
    borSammenMed: {
      label: {
        nb: "Hvem bor bidragspliktig sammen med?",
        nn: "",
        en: "",
      },
    },
    borMedBarnOver18: {
      label: {
        nb: "Bor bidragspliktig sammen med egne barn som går på videregående skole?",
        nn: "",
        en: "",
      },
    },
    antallBarnOver18: {
      label: {
        nb: "Antall barn som går på videregående skole",
        nn: "",
        en: "",
      },
    },
    andreBarnebidragerPerMåned: {
      label: {
        nb: "Hvor mye betaler bidragspliktig] totalt i barnebidrag for andre egne barn per måned?",
        nn: "",
        en: "",
      },
    },
  },
  felles: {
    jaNei: {
      true: {
        nb: "Ja",
        nn: "Ja",
        en: "Yes",
      },
      false: {
        nb: "Nei",
        nn: "Nei",
        en: "No",
      },
    },
  },
});
