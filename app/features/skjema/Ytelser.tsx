import {
  BodyShort,
  Checkbox,
  Radio,
  RadioGroup,
  Stack,
} from "@navikt/ds-react";
import { useFormContext } from "@rvf/react";
import { useEffect, useState } from "react";
import { FormattertTallTextField } from "~/components/ui/FormattertTallTextField";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import {
  MAKS_ALDER_KONTANTSTØTTE,
  MAKS_ALDER_SMÅBARNSTILLEGG,
  MAKS_ALDER_UTVIDET_BARNETRYGD,
  MIN_ALDER_KONTANTSTØTTE,
  type BarnebidragSkjema,
  type Bidragstype,
} from "./schema";

type NavYtelse =
  | "utvidet-barnetrygd"
  | "småbarnstillegg"
  | "kontantstøtte"
  | "barnetillegg";

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
  const harBarnIKontantstøtteAlder = barn.some(
    (b) =>
      Number(b.alder) >= MIN_ALDER_KONTANTSTØTTE &&
      Number(b.alder) <= MAKS_ALDER_KONTANTSTØTTE,
  );

  // Sjekk om noe barn har delt bosted
  const harDeltBosted = barn.some((b) => b.bosted === "DELT_FAST_BOSTED");

  // State for valgte ytelser
  const [valgteYtelser, setValgteYtelser] = useState<NavYtelse[]>([]);

  // Initialiser fra skjemaverdier
  useEffect(() => {
    const ytelser: NavYtelse[] = [];
    if (form.value("ytelser.mottarUtvidetBarnetrygd") === "true") {
      ytelser.push("utvidet-barnetrygd");
    }
    if (form.value("ytelser.mottarSmåbarnstillegg") === "true") {
      ytelser.push("småbarnstillegg");
    }
    if (form.value("ytelser.mottarKontantstøtte") === "true") {
      ytelser.push("kontantstøtte");
    }
    if (form.value("ytelser.mottarBarnetillegg") === "true") {
      ytelser.push("barnetillegg");
    }
    setValgteYtelser(ytelser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const håndterToggleYtelse = (value: NavYtelse, erValgt: boolean) => {
    const nyeValgteYtelser: NavYtelse[] = erValgt
      ? [...valgteYtelser, value]
      : valgteYtelser.filter((y) => y !== value);

    setValgteYtelser(nyeValgteYtelser);

    // Oppdater form-verdier
    form.setValue(
      "ytelser.mottarUtvidetBarnetrygd",
      nyeValgteYtelser.includes("utvidet-barnetrygd") ? "true" : "false",
    );
    form.setValue(
      "ytelser.mottarSmåbarnstillegg",
      nyeValgteYtelser.includes("småbarnstillegg") ? "true" : "false",
    );
    form.setValue(
      "ytelser.mottarKontantstøtte",
      nyeValgteYtelser.includes("kontantstøtte") ? "true" : "false",
    );
    form.setValue(
      "ytelser.mottarBarnetillegg",
      nyeValgteYtelser.includes("barnetillegg") ? "true" : "false",
    );

    // Nullstill kontantstøtte-beløp hvis kontantstøtte fjernes
    if (!nyeValgteYtelser.includes("kontantstøtte")) {
      form.setValue("ytelser.kontantstøtteBeløp", "");
    }

    // Nullstill deling hvis utvidet barnetrygd fjernes
    if (!nyeValgteYtelser.includes("utvidet-barnetrygd")) {
      form.setValue("ytelser.delerUtvidetBarnetrygd", "");
    }
  };

  const mottarUtvidetBarnetrygd = valgteYtelser.includes("utvidet-barnetrygd");
  const mottarKontantstøtte = valgteYtelser.includes("kontantstøtte");

  return (
    <div className="border p-4 rounded-md">
      <fieldset className="p-0 flex flex-col gap-4">
        <legend className="text-xl mb-2">{t(tekster.felles.overskrift)}</legend>
        <BodyShort>{t(tekster[bidragstype].beskrivelse)}</BodyShort>

        {harBarnIKontantstøtteAlder && (
          <>
            <Checkbox
              value="public"
              onChange={(e) =>
                håndterToggleYtelse("kontantstøtte", e.target.checked)
              }
            >
              {t(tekster.felles.alternativer.kontantstøtte)}
            </Checkbox>
            {mottarKontantstøtte && (
              <FormattertTallTextField
                {...form.field("ytelser.kontantstøtteBeløp").getControlProps()}
                label={t(tekster[bidragstype].kontantstøtte.beløpLabel)}
                error={form.field("ytelser.kontantstøtteBeløp").error()}
                htmlSize={15}
                className="pl-8"
              />
            )}
          </>
        )}

        {harBarnUnderUtvidetBarnetrygdAlder && (
          <>
            <Checkbox
              checked={valgteYtelser.includes("utvidet-barnetrygd")}
              onChange={(e) =>
                håndterToggleYtelse("utvidet-barnetrygd", e.target.checked)
              }
            >
              {t(tekster.felles.alternativer.utvidetBarnetrygd)}
            </Checkbox>
            {mottarUtvidetBarnetrygd && harDeltBosted && (
              <RadioGroup
                {...form
                  .field("ytelser.delerUtvidetBarnetrygd")
                  .getInputProps()}
                legend={t(tekster.felles.utvidetBarnetrygd.delingSpørsmål)}
                error={form.field("ytelser.delerUtvidetBarnetrygd").error()}
                className="pl-8"
              >
                <Stack
                  gap="space-0 space-24"
                  direction={{ xs: "column", sm: "row" }}
                  wrap={false}
                >
                  <Radio value="true">
                    {t(tekster.felles.utvidetBarnetrygd.alternativer.ja)}
                  </Radio>
                  <Radio value="false">
                    {t(tekster.felles.utvidetBarnetrygd.alternativer.nei)}
                  </Radio>
                </Stack>
              </RadioGroup>
            )}
          </>
        )}

        {harBarnUnderSmåbarnstilleggAlder && (
          <Checkbox
            checked={valgteYtelser.includes("småbarnstillegg")}
            onChange={(e) =>
              håndterToggleYtelse("småbarnstillegg", e.target.checked)
            }
          >
            {t(tekster.felles.alternativer.småbarnstillegg)}
          </Checkbox>
        )}

        <Checkbox
          checked={valgteYtelser.includes("barnetillegg")}
          onChange={(e) =>
            håndterToggleYtelse("barnetillegg", e.target.checked)
          }
        >
          {t(tekster.felles.alternativer.barnetillegg)}
        </Checkbox>
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
    kontantstøtte: {
      beløpLabel: {
        nb: "Hvor mye mottar du i kontantstøtte per måned?",
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
    kontantstøtte: {
      beløpLabel: {
        nb: "Hvor mye mottar bidragsmottaker i kontantstøtte per måned?",
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
      alternativer: {
        ja: {
          nb: "Ja",
          en: "Yes",
          nn: "Ja",
        },
        nei: {
          nb: "Nei",
          en: "No",
          nn: "Nei",
        },
      },
    },
  },
});
