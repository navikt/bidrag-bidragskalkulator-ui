import { Checkbox } from "@navikt/ds-react";
import { useFormContext } from "@rvf/react";
import { FormattertTallTextField } from "~/components/ui/FormattertTallTextField";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { type BarnebidragSkjema } from "../schema";
import type { NavYtelse } from "../Ytelser";

type Props = {
  valgteYtelser: NavYtelse[];
  barnUnder18: BarnebidragSkjema["barn"];
};

export default function Barnetillegg({ valgteYtelser, barnUnder18 }: Props) {
  const form = useFormContext<BarnebidragSkjema>();
  const { t } = useOversettelse();

  const håndterToggleBarnetillegg = (
    value: "MEG" | "DEN_ANDRE_FORELDREN",
    erValgt: boolean,
  ) => {
    const hvemFårBarnetillegg = form.value("ytelser.barnetillegg.hvemFår");

    const nyeValg = erValgt
      ? [...hvemFårBarnetillegg, value]
      : hvemFårBarnetillegg.filter((v) => v !== value);

    form.setValue("ytelser.barnetillegg.hvemFår", nyeValg);

    // Nullstill beløp når du fjerner valg
    if (!erValgt) {
      if (value === "MEG") {
        form.setValue("ytelser.barnetillegg.dineBeløpPerBarn", []);
      } else {
        form.setValue("ytelser.barnetillegg.denAndreForelderenBeløp", "");
      }
    } else {
      // Initialiser beløp-array når MEG velges - bare for barn under 18
      if (value === "MEG") {
        form.setValue(
          "ytelser.barnetillegg.dineBeløpPerBarn",
          barnUnder18.map(() => ""),
        );
      }
    }
  };

  // Barnetillegg
  const harBarnetillegg = valgteYtelser.includes("barnetillegg");
  const jegFårBarnetillegg = form
    .value("ytelser.barnetillegg.hvemFår")
    .includes("MEG");
  const denAndreForelderenFårBarnetillegg = form
    .value("ytelser.barnetillegg.hvemFår")
    .includes("DEN_ANDRE_FORELDREN");
  return (
    <>
      {harBarnetillegg && (
        <div className="pl-8 flex flex-col gap-4">
          {/* ✅ Checkbox: Jeg får utbetalt */}
          <Checkbox
            checked={jegFårBarnetillegg}
            onChange={(e) => håndterToggleBarnetillegg("MEG", e.target.checked)}
          >
            {t(tekster.felles.barnetillegg.hvemFår.MEG)}
          </Checkbox>

          {/* ✅ Beløp per barn - bare for barn under 18 */}
          {jegFårBarnetillegg && (
            <div className="pl-8 flex flex-col gap-4">
              {barnUnder18.map((enkeltBarn, index) => (
                <FormattertTallTextField
                  key={index}
                  {...form
                    .field(`ytelser.barnetillegg.dineBeløpPerBarn[${index}]`)
                    .getControlProps()}
                  label={t(
                    tekster.felles.barnetillegg.beløpPerBarn(
                      Number(enkeltBarn.alder),
                    ),
                  )}
                  error={form
                    .field(`ytelser.barnetillegg.dineBeløpPerBarn[${index}]`)
                    .error()}
                  htmlSize={12}
                />
              ))}
            </div>
          )}

          {/* ✅ Checkbox: Den andre forelderen får utbetalt */}
          <Checkbox
            checked={denAndreForelderenFårBarnetillegg}
            onChange={(e) =>
              håndterToggleBarnetillegg("DEN_ANDRE_FORELDREN", e.target.checked)
            }
          >
            {t(tekster.felles.barnetillegg.hvemFår.DEN_ANDRE_FORELDREN)}
          </Checkbox>

          {/* ✅ Ett samlet beløp for den andre forelderen */}
          {denAndreForelderenFårBarnetillegg && (
            <div className="pl-8">
              <FormattertTallTextField
                {...form
                  .field("ytelser.barnetillegg.denAndreForelderenBeløp")
                  .getControlProps()}
                label={t(tekster.felles.barnetillegg.denAndreForelderenBeløp)}
                error={form
                  .field("ytelser.barnetillegg.denAndreForelderenBeløp")
                  .error()}
                htmlSize={12}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

const tekster = definerTekster({
  felles: {
    overskrift: {
      nb: "Pengestøtte fra Nav",
      en: "",
      nn: "",
    },
    alternativer: {
      utvidetBarnetrygd: {
        nb: "Utvidet barnetrygd",
        en: "Extended child benefit",
        nn: "Utvida barnetrygd",
      },
      småbarnstillegg: {
        nb: "Småbarnstillegg",
        en: "Infant supplement",
        nn: "Småbarnstillegg",
      },
      kontantstøtte: {
        nb: "Kontantstøtte",
        en: "Cash-for-care benefit",
        nn: "Kontantstøtte",
      },
      barnetillegg: {
        nb: "Barnetillegg",
        en: "",
        nn: "Barnetillegg",
      },
    },
    utvidetBarnetrygd: {
      delingSpørsmål: {
        nb: "Deler du og den andre forelderen den utvidede barnetrygden?",
        en: "",
        nn: "Deler du og den andre forelderen den utvidede barnetrygden?",
      },
    },
    barnetillegg: {
      beskrivelse: {
        nb: "Aktuelt for deg som for eksempel har uføretrygd, arbeidsavklaringspenger eller dagpenger",
        en: "Relevant for you who, for example, have disability pension, work assessment allowance or unemployment benefits",
        nn: "Aktuelt for deg som til dømes har uføretrygd, arbeidsavklaringspengar eller dagpengar",
      },
      hvemFår: {
        MEG: {
          nb: "Jeg får utbetalt barnetillegg",
          en: "I receive child supplement",
          nn: "Eg får utbetalt barnetillegg",
        },
        DEN_ANDRE_FORELDREN: {
          nb: "Den andre forelderen får utbetalt barnetillegg",
          en: "The other parent receives child supplement",
          nn: "Den andre forelderen får utbetalt barnetillegg",
        },
      },
      beløpPerBarn: (alder) => ({
        nb: `Hvor mye får du utbetalt i barnetillegg for barnet ${alder} år?`,
        en: `How much child supplement do you receive for the ${alder} year old child?`,
        nn: `Kor mykje får du utbetalt i barnetillegg for barnet ${alder} år?`,
      }),
      denAndreForelderenBeløp: {
        nb: "Hvor mye får den andre forelderen utbetalt i barnetillegg per måned?",
        en: "How much child supplement does the other parent receive per month?",
        nn: "Kor mykje får den andre forelderen utbetalt i barnetillegg per månad?",
      },
    },
  },
});
