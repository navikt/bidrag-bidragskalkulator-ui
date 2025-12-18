import { useFormContext } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { FormattertTallTextField } from "../../components/ui/FormattertTallTextField";

import { Radio, RadioGroup } from "@navikt/ds-react";
import JaNeiRadio from "~/components/ui/JaNeiRadio";
import { BorMedAnnenVoksenTypeSchema, type BarnebidragSkjema } from "./schema";
import { sporKalkulatorSpørsmålBesvart } from "./utils";

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
      <JaNeiRadio
        {...form.field(`${skjemagruppe}.borMedAndreBarn`).getInputProps({
          onChange: vedEndreBorMedAndreBarn,
          legend: t(tekster[skjemagruppe].borMedAndreBarn.label),
          error: form.field(`${skjemagruppe}.borMedAndreBarn`).error(),
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
            className="pl-8"
          />
        </>
      )}

      <JaNeiRadio
        {...form.field(`${skjemagruppe}.borMedAnnenVoksen`).getInputProps()}
        error={form.field(`${skjemagruppe}.borMedAnnenVoksen`).error()}
        legend={t(tekster[skjemagruppe].borMedAnnenVoksen.label)}
      />

      {borMedAnnenVoksen && (
        <>
          <RadioGroup
            {...form
              .field(`${skjemagruppe}.borMedAnnenVoksenType`)
              .getInputProps()}
            error={form.field(`${skjemagruppe}.borMedAnnenVoksenType`).error()}
            legend={t(tekster[skjemagruppe].borSammenMed.label)}
            className="pl-8"
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
              <JaNeiRadio
                {...form
                  .field(`${skjemagruppe}.borMedBarnOver18`)
                  .getInputProps()}
                error={form.field(`${skjemagruppe}.borMedBarnOver18`).error()}
                legend={t(tekster[skjemagruppe].borMedBarnOver18.label)}
                className="pl-8"
              />

              {borMedBarnVgs && (
                <FormattertTallTextField
                  {...form
                    .field(`${skjemagruppe}.antallBarnOver18`)
                    .getControlProps()}
                  label={t(tekster[skjemagruppe].antallBarnOver18.label)}
                  error={form.field(`${skjemagruppe}.antallBarnOver18`).error()}
                  htmlSize={8}
                  className="pl-8"
                />
              )}
            </>
          )}
        </>
      )}

      {harAlleredeBarnebidrag && (
        <FormattertTallTextField
          {...form
            .field(`${skjemagruppe}.andreBarnebidragerPerMåned`)
            .getControlProps()}
          label={t(tekster[skjemagruppe].andreBarnebidragerPerMåned.label)}
          error={form
            .field(`${skjemagruppe}.andreBarnebidragerPerMåned`)
            .error()}
          htmlSize={10}
          className="pl-8"
        />
      )}
    </fieldset>
  );
};

const tekster = definerTekster({
  dittBoforhold: {
    antallBarnBorFast: {
      label: {
        nb: "Hvor mange andre egne barn bor fast hos deg?",
        nn: "Kor mange andre eigne barn bur fast hos deg?",
        en: "How many other own children live permanently with you?",
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
        nn: "Bur du saman med vaksne over 18 år?",
        en: "Do you live with adults over 18 years?",
      },
    },
    borMedAndreBarn: {
      label: {
        nb: "Har du andre egne barn under 18 år som bor fast hos deg",
        nn: "Har du andre eigne barn under 18 år som bur fast hos deg",
        en: "Do you have other own children under 18 years who live permanently with you",
      },
    },
    borMedAnnenVoksenType: {
      SAMBOER_ELLER_EKTEFELLE: {
        nb: "Samboer eller ektefelle",
        nn: "Sambuar eller ektefelle",
        en: "Cohabitant or spouse",
      },
      EGNE_BARN_OVER_18: {
        nb: "Egne barn over 18 år",
        nn: "Eigne barn over 18 år",
        en: "Own children over 18 years",
      },
    },
    borSammenMed: {
      label: {
        nb: "Hvem bor du sammen med?",
        nn: "Kven bur du saman med?",
        en: "Who do you live with?",
      },
    },
    borMedBarnOver18: {
      label: {
        nb: "Bor du sammen med egne barn som går på videregående skole?",
        nn: "Bur du saman med eigne barn som går på vidaregåande skule?",
        en: "Do you live with own children who are in upper secondary school?",
      },
    },
    antallBarnOver18: {
      label: {
        nb: "Antall barn som går på videregående skole",
        nn: "Antall barn som går på vidaregåande skule",
        en: "Number of children in upper secondary school",
      },
    },
    andreBarnebidragerPerMåned: {
      label: {
        nb: "Hvor mye betaler du totalt i barnebidrag for andre egne barn per måned?",
        nn: "Kor mykje betalar du totalt i barnebidrag for andre eigne barn per månad?",
        en: "How much do you pay in child support for other own children per month?",
      },
    },
  },
  medforelderBoforhold: {
    antallBarnBorFast: {
      label: {
        nb: "Hvor mange andre egne barn bor fast hos den andre forelderen?",
        nn: "Kor mange andre eigne barn bur fast hos den andre forelderen?",
        en: "How many other own children live permanently with the other parent?",
      },
      beskrivelse: {
        nb: "Barn du har lagt inn tidligere i kalkulatoren, skal ikke telles med her.",
        nn: "Barn du har lagt inn tidlegare i kalkulatoren, skal du ikkje telje med her.",
        en: "Children you have previously entered in the calculator should not be included here.",
      },
    },
    borMedAnnenVoksen: {
      label: {
        nb: "Bor den andre forelderen sammen med voksne over 18 år?",
        nn: "Bur den andre forelderen saman med vaksne over 18 år?",
        en: "Does the other parent live with adults over 18 years?",
      },
    },
    borMedAndreBarn: {
      label: {
        nb: "Har den andre forelderen andre egne barn under 18 år som bor fast hos seg?",
        nn: "Har den andre forelderen andre eigne barn under 18 år som bur fast hos seg?",
        en: "Does the other parent have other own children under 18 years who live permanently with them?",
      },
    },
    borMedAnnenVoksenType: {
      SAMBOER_ELLER_EKTEFELLE: {
        nb: "Samboer eller ektefelle",
        nn: "Sambuar eller ektefelle",
        en: "Cohabitant or spouse",
      },
      EGNE_BARN_OVER_18: {
        nb: "Egne barn over 18 år",
        nn: "Eigne barn over 18 år",
        en: "Own children over 18 years",
      },
    },
    borSammenMed: {
      label: {
        nb: "Hvem bor den andre forelderen sammen med?",
        nn: "Hvem bur den andre forelderen saman med?",
        en: "Who does the other parent live with?",
      },
    },
    borMedBarnOver18: {
      label: {
        nb: "Bor den andre forelderen sammen med egne barn som går på videregående skole?",
        nn: "Bur den andre forelderen saman med eigne barn som går på vidaregåande skule?",
        en: "Does the other parent live with own children who are in upper secondary school?",
      },
    },
    antallBarnOver18: {
      label: {
        nb: "Antall barn som går på videregående skole",
        nn: "Antall barn som går på vidaregåande skule",
        en: "Number of children in upper secondary school",
      },
    },
    andreBarnebidragerPerMåned: {
      label: {
        nb: "Hvor mye betaler den andre forelderen totalt i barnebidrag for andre egne barn per måned?",
        nn: "Kor mykje betalar den andre forelderen totalt i barnebidrag for andre eigne barn per månad?",
        en: "How much does the other parent pay in child support for other own children per month?",
      },
    },
  },
});
