import { useFormContext } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { FormattertTallTextField } from "../../../components/ui/FormattertTallTextField";

import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import JaNeiRadio from "~/components/ui/JaNeiRadio";
import { BorMedAnnenVoksenTypeSchema, type BarnebidragSkjema } from "../schema";
import { sporKalkulatorSpørsmålBesvart } from "../utils";
import { useTilbakestillBoforholdFelter } from "./useTilbakestillBoforholdFelter";

type Props = {
  part: "deg" | "medforelder";
};

export const BoforholdEnkeltPart = ({ part }: Props) => {
  const form = useFormContext<BarnebidragSkjema>();
  const { t } = useOversettelse();

  const skjemagruppe =
    part === "deg" ? "dittBoforhold" : "medforelderBoforhold";

  const harBarnUnder18 =
    form.field(`${skjemagruppe}.harBarnUnder18`).value() === "true";

  const harVoksneOver18 =
    form.field(`${skjemagruppe}.harVoksneOver18`).value() === "true";

  const voksneOver18Type = form
    .field(`${skjemagruppe}.voksneOver18Type`)
    .value();

  const harEgneBarnOver18 = voksneOver18Type.includes("EGNE_BARN_OVER_18");

  const harBarnOver18Vgs =
    form.field(`${skjemagruppe}.harBarnOver18Vgs`).value() === "true";

  // Reset avhengige felt basert på boforhold-valg
  useTilbakestillBoforholdFelter(
    form,
    skjemagruppe,
    harVoksneOver18,
    harEgneBarnOver18,
    harBarnOver18Vgs,
  );

  const vedEndreHarBarnUnder18 = (value: string) => {
    if (value === "false") {
      form.resetField(`${skjemagruppe}.antallBarnUnder18`);
    }
  };

  return (
    <fieldset className="p-0 flex flex-col gap-4">
      <JaNeiRadio
        {...form.field(`${skjemagruppe}.harBarnUnder18`).getInputProps({
          onChange: vedEndreHarBarnUnder18,
          legend: t(tekster[skjemagruppe].harBarnUnder18.label),
          error: form.field(`${skjemagruppe}.harBarnUnder18`).error(),
        })}
      />

      {harBarnUnder18 && (
        <>
          <FormattertTallTextField
            {...form
              .field(`${skjemagruppe}.antallBarnUnder18`)
              .getControlProps()}
            label={t(tekster[skjemagruppe].antallBarnUnder18.label)}
            error={form.field(`${skjemagruppe}.antallBarnUnder18`).error()}
            description={t(tekster[skjemagruppe].antallBarnUnder18.beskrivelse)}
            onBlur={sporKalkulatorSpørsmålBesvart(
              `${part}-antall-barn-bor-fast`,
              t(tekster[skjemagruppe].antallBarnUnder18.label),
            )}
            htmlSize={8}
            className="pl-8"
          />
        </>
      )}

      <JaNeiRadio
        {...form.field(`${skjemagruppe}.harVoksneOver18`).getInputProps()}
        error={form.field(`${skjemagruppe}.harVoksneOver18`).error()}
        legend={t(tekster[skjemagruppe].harVoksneOver18.label)}
      />

      {harVoksneOver18 && (
        <>
          <CheckboxGroup
            {...form.field(`${skjemagruppe}.voksneOver18Type`).getInputProps()}
            error={form.field(`${skjemagruppe}.voksneOver18Type`).error()}
            legend={t(tekster[skjemagruppe].borSammenMed.label)}
            className="pl-8"
          >
            {BorMedAnnenVoksenTypeSchema.options.map((alternativ) => {
              return (
                <Checkbox value={alternativ} key={alternativ}>
                  {t(tekster[skjemagruppe].voksneOver18Type[alternativ])}
                </Checkbox>
              );
            })}
          </CheckboxGroup>

          {harEgneBarnOver18 && (
            <>
              <JaNeiRadio
                {...form
                  .field(`${skjemagruppe}.harBarnOver18Vgs`)
                  .getInputProps()}
                error={form.field(`${skjemagruppe}.harBarnOver18Vgs`).error()}
                legend={t(tekster[skjemagruppe].harBarnOver18Vgs.label)}
                className="pl-8"
              />

              {harBarnOver18Vgs && (
                <FormattertTallTextField
                  {...form
                    .field(`${skjemagruppe}.antallBarnOver18Vgs`)
                    .getControlProps()}
                  label={t(tekster[skjemagruppe].antallBarnOver18Vgs.label)}
                  error={form
                    .field(`${skjemagruppe}.antallBarnOver18Vgs`)
                    .error()}
                  htmlSize={8}
                  className="pl-8"
                />
              )}
            </>
          )}
        </>
      )}
    </fieldset>
  );
};

const tekster = definerTekster({
  dittBoforhold: {
    antallBarnUnder18: {
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
    harVoksneOver18: {
      label: {
        nb: "Bor du sammen med voksne over 18 år?",
        nn: "Bur du saman med vaksne over 18 år?",
        en: "Do you live with adults over 18 years?",
      },
    },
    harBarnUnder18: {
      label: {
        nb: "Har du andre egne barn under 18 år som bor fast hos deg",
        nn: "Har du andre eigne barn under 18 år som bur fast hos deg",
        en: "Do you have other own children under 18 years who live permanently with you",
      },
    },
    voksneOver18Type: {
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
    harBarnOver18Vgs: {
      label: {
        nb: "Bor du sammen med egne barn som går på videregående skole?",
        nn: "Bur du saman med eigne barn som går på vidaregåande skule?",
        en: "Do you live with own children who are in upper secondary school?",
      },
    },
    antallBarnOver18Vgs: {
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
    antallBarnUnder18: {
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
    harVoksneOver18: {
      label: {
        nb: "Bor den andre forelderen sammen med voksne over 18 år?",
        nn: "Bur den andre forelderen saman med vaksne over 18 år?",
        en: "Does the other parent live with adults over 18 years?",
      },
    },
    harBarnUnder18: {
      label: {
        nb: "Har den andre forelderen andre egne barn under 18 år som bor fast hos seg?",
        nn: "Har den andre forelderen andre eigne barn under 18 år som bur fast hos seg?",
        en: "Does the other parent have other own children under 18 years who live permanently with them?",
      },
    },
    voksneOver18Type: {
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
    harBarnOver18Vgs: {
      label: {
        nb: "Bor den andre forelderen sammen med egne barn som går på videregående skole?",
        nn: "Bur den andre forelderen saman med eigne barn som går på vidaregåande skule?",
        en: "Does the other parent live with own children who are in upper secondary school?",
      },
    },
    antallBarnOver18Vgs: {
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
