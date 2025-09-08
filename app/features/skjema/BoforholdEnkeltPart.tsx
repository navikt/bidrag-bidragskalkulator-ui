import { useFormContext } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { FormattertTallTextField } from "../../components/ui/FormattertTallTextField";

import { Radio, RadioGroup, Stack } from "@navikt/ds-react";
import { sporHendelse } from "~/utils/analytics";
import type { BarnebidragSkjema } from "./schema";
import { sporKalkulatorSpørsmålBesvart } from "./utils";

const BOR_MED_ANNEN_VOKSEN_ALTERNATIVER = ["true", "false"] as const;
const BOR_MED_ANDRE_BARN_ALTERNATIVER = ["true", "false"] as const;

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

  const vedEndreBorMedAndreBarn = (value: string) => {
    if (value === "false") {
      form.resetField(`${skjemagruppe}.antallBarnBorFast`);
      form.resetField(`${skjemagruppe}.antallBarnDeltBosted`);
    }
  };

  return (
    <fieldset className="p-0 flex flex-col gap-4">
      <legend className="sr-only">{t(tekster[skjemagruppe].tittel)}</legend>
      <RadioGroup
        {...form.field(`${skjemagruppe}.borMedAnnenVoksen`).getInputProps()}
        error={form.field(`${skjemagruppe}.borMedAnnenVoksen`).error()}
        legend={t(tekster[skjemagruppe].borMedAnnenVoksen.label)}
      >
        <Stack gap="0 6" direction={{ xs: "column", sm: "row" }} wrap={false}>
          {BOR_MED_ANNEN_VOKSEN_ALTERNATIVER.map((alternativ) => {
            return (
              <Radio
                value={alternativ}
                key={alternativ}
                onChange={sporKalkulatorSpørsmålBesvart(
                  `${part}-bor-med-voksen`,
                  t(tekster[skjemagruppe].borMedAnnenVoksen.label),
                )}
              >
                {t(tekster[skjemagruppe].borMedAnnenVoksen[alternativ])}
              </Radio>
            );
          })}
        </Stack>
      </RadioGroup>

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
              {BOR_MED_ANDRE_BARN_ALTERNATIVER.map((alternativ) => {
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
                        svar: tekster[skjemagruppe].borMedAndreBarn[alternativ]
                          .nb,
                      });
                    }}
                  >
                    {t(tekster[skjemagruppe].borMedAndreBarn[alternativ])}
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

          <FormattertTallTextField
            {...form
              .field(`${skjemagruppe}.antallBarnDeltBosted`)
              .getControlProps()}
            label={t(tekster[skjemagruppe].antallBarnDeltBosted.label)}
            error={form.field(`${skjemagruppe}.antallBarnDeltBosted`).error()}
            description={t(
              tekster[skjemagruppe].antallBarnDeltBosted.beskrivelse,
            )}
            onBlur={sporKalkulatorSpørsmålBesvart(
              `${part}-antall-barn-bor-delt-bosted`,
              t(tekster[skjemagruppe].antallBarnDeltBosted.label),
            )}
            htmlSize={8}
          />
        </>
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
        nb: "Antall egne barn under 18 år som bor fast hos deg",
        nn: "Antal eigne barn under 18 år som bur fast hos deg",
        en: "Number of own children under 18 years living with you",
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
        en: "Number of own children under 18 years with shared custody living with you",
      },
      beskrivelse: {
        nb: "Barn du har lagt inn tidligere i kalkulatoren, skal ikke telles med her.",
        nn: "Barn du har lagt inn tidlegare i kalkulatoren, skal du ikkje telje med her.",
        en: "Children you have previously entered in the calculator should not be included here.",
      },
    },
    borMedAnnenVoksen: {
      label: {
        nb: "Bor du med en annen voksen?",
        nn: "Bur du med ein annan vaksen?",
        en: "Do you live with another adult?",
      },
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
    borMedAndreBarn: {
      label: {
        nb: "Bor du med andre egne barn enn de som er nevnt over?",
        nn: "Bur du med andre eigne barn enn dei som er nemnde over?",
        en: "Do you live with other own children than those mentioned above?",
      },
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
  medforelderBoforhold: {
    tittel: {
      nb: "Den andre forelderen sin bosituasjon",
      en: "The other parent's housing situation",
      nn: "Den andre forelderen sin busituasjon",
    },
    antallBarnBorFast: {
      label: {
        nb: "Antall egne barn under 18 år som bor fast hos den andre forelderen",
        nn: "Antal eigne barn under 18 år som bur fast hos den andre forelderen",
        en: "Number of own children under 18 years living with the other parent",
      },
      beskrivelse: {
        nb: "Barn du har lagt inn tidligere i kalkulatoren, skal ikke telles med her.",
        nn: "Barn du har lagt inn tidlegare i kalkulatoren, skal du ikkje telje med her.",
        en: "Children you have previously entered in the calculator should not be included here.",
      },
    },
    antallBarnDeltBosted: {
      label: {
        nb: "Antall egne barn under 18 år med delt bosted hos den andre forelderen",
        nn: "Antal eigne barn under 18 år med delt bustad hos den andre forelderen",
        en: "Number of own children under 18 years with shared custody living with the other parent",
      },
      beskrivelse: {
        nb: "Barn du har lagt inn tidligere i kalkulatoren, skal ikke telles med her.",
        nn: "Barn du har lagt inn tidlegare i kalkulatoren, skal du ikkje telje med her.",
        en: "Children you have previously entered in the calculator should not be included here.",
      },
    },
    borMedAnnenVoksen: {
      label: {
        nb: "Bor den andre forelderen med en annen voksen?",
        nn: "Bur den andre forelderen med ein annan vaksen?",
        en: "Does the other parent live with another adult?",
      },
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
    borMedAndreBarn: {
      label: {
        nb: "Bor den andre forelderen med andre egne barn enn de som er nevnt over?",
        nn: "Bur den andre forelderen med andre eigne barn enn dei som er nemnde over?",
        en: "Does the other parent live with other own children than those mentioned above?",
      },
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
