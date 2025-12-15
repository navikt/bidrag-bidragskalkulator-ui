import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { useFormContext } from "@rvf/react";
import { useEffect, useRef, useState } from "react";
import JaNeiRadio from "~/components/ui/JaNeiRadio";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import {
  MAKS_ALDER_BARNETILLEGG,
  MAKS_ALDER_SMÅBARNSTILLEGG,
  MAKS_ALDER_UTVIDET_BARNETRYGD,
  type BarnebidragSkjema,
  type Bidragstype,
} from "./schema";
import Kontantstøtte from "./ytelser/Kontantstøtte";

export type NavYtelse =
  | "utvidet-barnetrygd"
  | "småbarnstillegg"
  | "kontantstøtte";

type Props = {
  bidragstype: Bidragstype;
};

export const Ytelser = ({ bidragstype }: Props) => {
  const form = useFormContext<BarnebidragSkjema>();
  const { t } = useOversettelse();

  const barn = form.value("barn");

  // Sjekk aldersgrupper
  const harBarnUnderUtvidetBarnetrygdAlder = barn.some(
    (b) => Number(b.alder) < MAKS_ALDER_UTVIDET_BARNETRYGD,
  );
  const harBarnUnderSmåbarnstilleggAlder = barn.some(
    (b) => Number(b.alder) <= MAKS_ALDER_SMÅBARNSTILLEGG,
  );

  // Kontantstøtte er KUN for barn som er nøyaktig 1 år
  const harBarnIKontantstøtteAlder = barn.some((b) => Number(b.alder) === 1);

  const barnUnder18 = barn.filter(
    (b) => Number(b.alder) < MAKS_ALDER_BARNETILLEGG,
  );
  const harBarnUnderBarnetilleggAlder = barnUnder18.length > 0;

  // Sjekk om noe barn har delt bosted
  const harDeltBosted = barn.some((b) => b.bosted === "DELT_FAST_BOSTED");

  // State for valgte ytelser
  const [valgteYtelser, setValgteYtelser] = useState<NavYtelse[]>([]);

  // Ref for å tracke forrige barn-signatur
  const forrigeBarnSignatur = useRef<string>("");

  // Reset ytelser når barn-data endres (alder, antall, bosted)
  useEffect(() => {
    const barnSignatur = barn
      .map((b) => `${b.alder}-${b.bosted}`)
      .sort()
      .join("|");

    // Hvis barn-data har endret seg OG dette ikke er første render, reset alle ytelser
    if (
      forrigeBarnSignatur.current &&
      barnSignatur !== forrigeBarnSignatur.current
    ) {
      // Reset alle ytelse-verdier
      form.setValue("ytelser", {
        mottarUtvidetBarnetrygd: "",
        delerUtvidetBarnetrygd: "",
        mottarSmåbarnstillegg: "",
        kontantstøtte: {
          mottar: "",
          deler: "",
          beløp: "",
        },
      });

      // Reset state
      setValgteYtelser([]);
    }

    // Oppdater signaturen
    forrigeBarnSignatur.current = barnSignatur;
  }, [barn, form]);

  // Initialiser fra skjemaverdier - kjør hver gang form-verdiene endres
  useEffect(() => {
    const ytelser: NavYtelse[] = [];
    if (form.value("ytelser.mottarUtvidetBarnetrygd") === "true") {
      ytelser.push("utvidet-barnetrygd");
    }
    if (form.value("ytelser.mottarSmåbarnstillegg") === "true") {
      ytelser.push("småbarnstillegg");
    }
    if (form.value("ytelser.kontantstøtte.mottar") === "true") {
      ytelser.push("kontantstøtte");
    }
    setValgteYtelser(ytelser);
  }, [form]);

  const håndterToggleYtelse = (value: NavYtelse, erValgt: boolean) => {
    const nyeValgteYtelser: NavYtelse[] = erValgt
      ? [...valgteYtelser, value]
      : valgteYtelser.filter((y) => y !== value);

    setValgteYtelser(nyeValgteYtelser);

    // Oppdater form-verdier
    form.setValue(
      "ytelser.mottarUtvidetBarnetrygd",
      nyeValgteYtelser.includes("utvidet-barnetrygd") ? "true" : "",
    );
    form.setValue(
      "ytelser.mottarSmåbarnstillegg",
      nyeValgteYtelser.includes("småbarnstillegg") ? "true" : "",
    );
    form.setValue(
      "ytelser.kontantstøtte.mottar",
      nyeValgteYtelser.includes("kontantstøtte") ? "true" : "",
    );

    // Nullstill kontantstøtte-beløp hvis kontantstøtte fjernes
    if (!nyeValgteYtelser.includes("kontantstøtte")) {
      form.setValue("ytelser.kontantstøtte", {
        mottar: "",
        deler: "",
        beløp: "",
      });
    }

    // Nullstill deling hvis utvidet barnetrygd fjernes
    if (!nyeValgteYtelser.includes("utvidet-barnetrygd")) {
      form.setValue("ytelser.delerUtvidetBarnetrygd", "");
    }
  };

  const mottarUtvidetBarnetrygd = valgteYtelser.includes("utvidet-barnetrygd");

  return (
    <div className="border p-4 rounded-md">
      <fieldset className="p-0 flex flex-col gap-4">
        <legend className="text-xl mb-2">{t(tekster.felles.overskrift)}</legend>
        <BodyShort>{t(tekster[bidragstype].beskrivelse)}</BodyShort>

        {/* Kontantstøtte - kun for barn som er 1 år */}
        {harBarnIKontantstøtteAlder && (
          <>
            <CheckboxGroup
              legend={t(tekster.felles.alternativer.kontantstøtte)}
              hideLegend
              error={form.field("ytelser.kontantstøtte.mottar").error()}
              value={valgteYtelser.includes("kontantstøtte") ? ["true"] : []}
              onChange={(value) =>
                håndterToggleYtelse("kontantstøtte", value.includes("true"))
              }
            >
              <Checkbox value="true">
                {t(tekster.felles.alternativer.kontantstøtte)}
              </Checkbox>
            </CheckboxGroup>
            <Kontantstøtte
              valgteYtelser={valgteYtelser}
              harDeltBosted={harDeltBosted}
              bidragstype={bidragstype}
            />
          </>
        )}

        {/* Utvidet barnetrygd */}
        {harBarnUnderUtvidetBarnetrygdAlder && (
          <>
            <CheckboxGroup
              legend={t(tekster.felles.alternativer.utvidetBarnetrygd)}
              hideLegend
              error={form.field("ytelser.mottarUtvidetBarnetrygd").error()}
              value={
                valgteYtelser.includes("utvidet-barnetrygd") ? ["true"] : []
              }
              onChange={(value) =>
                håndterToggleYtelse(
                  "utvidet-barnetrygd",
                  value.includes("true"),
                )
              }
            >
              <Checkbox value="true">
                {t(tekster.felles.alternativer.utvidetBarnetrygd)}
              </Checkbox>
            </CheckboxGroup>
            {mottarUtvidetBarnetrygd && harDeltBosted && (
              <JaNeiRadio
                {...form
                  .field("ytelser.delerUtvidetBarnetrygd")
                  .getInputProps()}
                legend={t(tekster.felles.utvidetBarnetrygd.delingSpørsmål)}
                error={form.field("ytelser.delerUtvidetBarnetrygd").error()}
                className="pl-8"
              />
            )}
          </>
        )}

        {/* Småbarnstillegg */}
        {harBarnUnderSmåbarnstilleggAlder && (
          <CheckboxGroup
            legend={t(tekster.felles.alternativer.småbarnstillegg)}
            hideLegend
            error={form.field("ytelser.mottarSmåbarnstillegg").error()}
            value={valgteYtelser.includes("småbarnstillegg") ? ["true"] : []}
            onChange={(value) =>
              håndterToggleYtelse("småbarnstillegg", value.includes("true"))
            }
          >
            <Checkbox
              value="true"
              description={t(tekster[bidragstype].småbarnstillegg.beskrivelse)}
            >
              {t(tekster.felles.alternativer.småbarnstillegg)}
            </Checkbox>
          </CheckboxGroup>
        )}
      </fieldset>
    </div>
  );
};

const tekster = definerTekster({
  MOTTAKER: {
    overskrift: {
      nb: "Pengestøtte fra Nav",
      en: "",
      nn: "",
    },
    beskrivelse: {
      nb: "Kryss av hvis du har noen av disse støtteordningene og tilleggene",
      en: "",
      nn: "",
    },
    utvidetBarnetrygd: {
      delingBeskrivelse: {
        nb: "Når du mottar utvidet barnetrygd, regnes det som en del av inntekten din. Men siden barnet har delt bosted, kan dere velge å dele utvidet barnetrygd. Hvis dere gjør det, teller bare halvparten av beløpet i beregningen.",
        en: "When you receive extended child benefit, it counts as part of your income. But since the child has shared residence, you can choose to share extended child benefit. If you do, only half the amount counts in the calculation.",
        nn: "Når du mottar utvida barnetrygd, blir det rekna som ein del av inntekta di. Men sidan barnet har delt bustad, kan de velje å dele utvida barnetrygd. Viss de gjer det, tel berre halvparten av beløpet i utrekninga.",
      },
    },
    småbarnstillegg: {
      beskrivelse: {
        nb: "Aktuelt hvis du har full overgangsstønad og barn i alderen 0-3 år",
        en: "",
        nn: "",
      },
    },
  },
  PLIKTIG: {
    overskrift: {
      nb: "Pengestøtte fra Nav",
      en: "",
      nn: "",
    },
    beskrivelse: {
      nb: "Kryss av hvis bidragsmottaker har noen av disse støtteordningene og tilleggene",
      en: "",
      nn: "",
    },
    småbarnstillegg: {
      beskrivelse: {
        nb: "Aktuelt hvis forelderen har full overgangsstønad og barn i alderen 0-3 år",
        en: "",
        nn: "",
      },
    },
  },
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
