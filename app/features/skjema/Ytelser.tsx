import { Alert, Radio, RadioGroup, UNSAFE_Combobox } from "@navikt/ds-react";
import { useFormContext } from "@rvf/react";
import { useEffect, useMemo, useState } from "react";
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

type NavYtelse = "utvidet-barnetrygd" | "småbarnstillegg" | "kontantstøtte";

type Props = {
  bidragstype: Bidragstype;
};

export const Ytelser = ({ bidragstype }: Props) => {
  const form = useFormContext<BarnebidragSkjema>();
  const { t } = useOversettelse();

  const [visNyYtelseAlert, setVisNyYtelseAlert] = useState(false);
  const [forrigeAlternativer, setForrigeAlternativer] = useState<string[]>([]);

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
    setValgteYtelser(ytelser);
  }, []);

  // Definer alternativer med disabled-logikk
  const alleYtelser: { value: NavYtelse; label: string; disabled: boolean }[] =
    useMemo(
      () => [
        {
          value: "utvidet-barnetrygd",
          label: t(tekster.felles.alternativer.utvidetBarnetrygd),
          disabled: !harBarnUnderUtvidetBarnetrygdAlder,
        },
        {
          value: "småbarnstillegg",
          label: t(tekster.felles.alternativer.småbarnstillegg),
          disabled: !harBarnUnderSmåbarnstilleggAlder,
        },
        {
          value: "kontantstøtte",
          label: t(tekster.felles.alternativer.kontantstøtte),
          disabled: !harBarnIKontantstøtteAlder,
        },
      ],
      [
        harBarnUnderUtvidetBarnetrygdAlder,
        harBarnUnderSmåbarnstilleggAlder,
        harBarnIKontantstøtteAlder,
        t,
      ],
    );

  // Sjekk om nye alternativer er blitt tilgjengelige
  useEffect(() => {
    const nåværendeAlternativer = alleYtelser
      .filter((y) => !y.disabled)
      .map((y) => y.value);

    if (forrigeAlternativer.length > 0) {
      const nyeAlternativer = nåværendeAlternativer.filter(
        (alt) => !forrigeAlternativer.includes(alt),
      );

      if (nyeAlternativer.length > 0) {
        setVisNyYtelseAlert(true);
      }
    }

    setForrigeAlternativer(nåværendeAlternativer);
  }, [alleYtelser]);

  const håndterToggleYtelse = (value: string, erValgt: boolean) => {
    const ytelse = alleYtelser.find((y) => y.label === value);

    if (!ytelse) {
      return;
    }

    let nyeValgteYtelser: NavYtelse[];

    if (erValgt) {
      nyeValgteYtelser = [...valgteYtelser, ytelse.value];
    } else {
      nyeValgteYtelser = valgteYtelser.filter((y) => y !== ytelse.value);
    }

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

        <p className="text-gray-700">{t(tekster.felles.beskrivelse)}</p>

        {visNyYtelseAlert && (
          <Alert
            variant="info"
            size="small"
            closeButton
            onClose={() => setVisNyYtelseAlert(false)}
          >
            {t(tekster.felles.nyYtelseAlert)}
          </Alert>
        )}

        <UNSAFE_Combobox
          label={t(tekster[bidragstype].comboboxLabel)}
          description={t(tekster.felles.comboboxBeskrivelse)}
          options={alleYtelser
            .filter((ytelse) => !ytelse.disabled)
            .map((ytelse) => ytelse.label)}
          selectedOptions={valgteYtelser.map(
            (val) =>
              alleYtelser.find((ytelse) => ytelse.value === val)?.label || val,
          )}
          onToggleSelected={håndterToggleYtelse}
          isMultiSelect
        />

        <div className="text-sm text-gray-600 mt-1">
          <span className="font-semibold">
            {t(tekster.felles.tilgjengelig)}:
          </span>{" "}
          {alleYtelser
            .filter((y) => !y.disabled)
            .map((y, idx, arr) => (
              <span key={y.value}>
                {y.label}
                {idx < arr.length - 1 ? ", " : ""}
              </span>
            ))}
        </div>

        {/* Utvidet barnetrygd - deling */}
        {mottarUtvidetBarnetrygd && harDeltBosted && (
          <div className="mt-2 p-4 bg-blue-50 rounded-md">
            <RadioGroup
              {...form.field("ytelser.delerUtvidetBarnetrygd").getInputProps()}
              legend={t(tekster.felles.utvidetBarnetrygd.delingSpørsmål)}
              description={t(
                tekster[bidragstype].utvidetBarnetrygd.delingBeskrivelse,
              )}
              size="small"
              error={form.field("ytelser.delerUtvidetBarnetrygd").error()}
            >
              <Radio value="false">{t(tekster[bidragstype].mottarAlt)}</Radio>
              <Radio value="true">{t(tekster.felles.viDeler)}</Radio>
            </RadioGroup>
          </div>
        )}

        {/* Kontantstøtte - beløp */}
        {mottarKontantstøtte && (
          <div className="mt-2 p-4 bg-blue-50 rounded-md">
            <FormattertTallTextField
              {...form.field("ytelser.kontantstøtteBeløp").getControlProps()}
              label={t(tekster[bidragstype].kontantstøtte.beløpLabel)}
              description={t(
                tekster[bidragstype].kontantstøtte.beløpBeskrivelse,
              )}
              error={form.field("ytelser.kontantstøtteBeløp").error()}
              htmlSize={10}
              size="small"
              // onBlur={sporKalkulatorSpørsmålBesvart(
              //   "kontantstotte-belop",
              //   t(tekster.kontantstøtte.beløpLabel),
              // )}
            />
          </div>
        )}
      </fieldset>
    </div>
  );
};

const tekster = definerTekster({
  MOTTAKER: {
    comboboxLabel: {
      nb: "Mottar du noen av disse ytelsene?",
      en: "Do you receive any of these benefits?",
      nn: "Mottar du nokon av desse ytingane?",
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
        nb: "Hvor mye kontantstøtte mottar du per måned?",
        en: "How much cash-for-care benefit do you receive per month?",
        nn: "Kor mykje kontantstøtte mottar du per månad?",
      },
      beløpBeskrivelse: {
        nb: "Oppgi det totale beløpet du mottar",
        en: "Enter the total amount you receive",
        nn: "Oppgi det totale beløpet du mottar",
      },
    },
    mottarAlt: {
      nb: "Nei, jeg mottar alt",
      en: "No, I receive all",
      nn: "Nei, eg mottar alt",
    },
  },
  PLIKTIG: {
    comboboxLabel: {
      nb: "Mottar den andre forelderen noen av disse ytelsene?",
      en: "Do the other parent receive any of these benefits?",
      nn: "Mottar den andre forelderen nokon av desse ytingane?",
    },
    utvidetBarnetrygd: {
      delingBeskrivelse: {
        nb: "Når den andre forelderen mottar utvidet barnetrygd, regnes det som en del av inntekten din. Men siden barnet har delt bosted, kan dere velge å dele utvidet barnetrygd. Hvis dere gjør det, teller bare halvparten av beløpet i beregningen.",
        en: "When the other parent receive extended child benefit, it counts as part of your income. But since the child has shared residence, you can choose to share extended child benefit. If you do, only half the amount counts in the calculation.",
        nn: "Når den andre forelderen mottar utvida barnetrygd, blir det rekna som ein del av inntekta di. Men sidan barnet har delt bustad, kan de velje å dele utvida barnetrygd. Viss de gjer det, tel berre halvparten av beløpet i utrekninga.",
      },
    },
    kontantstøtte: {
      beløpLabel: {
        nb: "Hvor mye kontantstøtte mottar den andre forelderen per måned?",
        en: "How much cash-for-care benefit do the other parent receive per month?",
        nn: "Kor mykje kontantstøtte mottar den andre forelderen per månad?",
      },
      beløpBeskrivelse: {
        nb: "Oppgi det totale beløpet den andre forelderen mottar",
        en: "Enter the total amount the other parent receive",
        nn: "Oppgi det totale beløpet den andre forelderen mottar",
      },
    },
    mottarAlt: {
      nb: "Nei, den andre forelderen mottar alt",
      en: "No, the other parent receive all",
      nn: "Nei, den andre forelderen mottar alt",
    },
  },
  felles: {
    overskrift: {
      nb: "Ytelser fra Nav",
      en: "Benefits from Nav",
      nn: "Ytingar frå Nav",
    },
    beskrivelse: {
      nb: "Enkelte ytelser fra Nav påvirker beregningen av barnebidrag.",
      en: "Certain benefits from Nav affect the calculation of child support.",
      nn: "Enkelte ytingar frå Nav påverkar utrekninga av barnebidrag.",
    },
    nyYtelseAlert: {
      nb: "Nye ytelser er nå tilgjengelige basert på barnets alder",
      en: "New benefits are now available based on the child's age",
      nn: "Nye ytingar er no tilgjengelege basert på barnet sin alder",
    },
    tilgjengelig: {
      nb: "Tilgjengelige ytelser",
      en: "Available benefits",
      nn: "Tilgjengelege ytingar",
    },
    comboboxBeskrivelse: {
      nb: "Velg alle som passer",
      en: "Select all that apply",
      nn: "Vel alle som passar",
    },
    alternativer: {
      utvidetBarnetrygd: {
        nb: "Utvidet barnetrygd",
        en: "Extended child benefit",
        nn: "Utvida barnetrygd",
      },
      småbarnstillegg: {
        nb: "Småbarnstillegg (0-3 år)",
        en: "Infant supplement (0-3 years)",
        nn: "Småbarnstillegg (0-3 år)",
      },
      kontantstøtte: {
        nb: "Kontantstøtte (1-2 år)",
        en: "Cash-for-care benefit (1-2 years)",
        nn: "Kontantstøtte (1-2 år)",
      },
    },
    utvidetBarnetrygd: {
      delingSpørsmål: {
        nb: "Deler dere utvidet barnetrygd?",
        en: "Do you share extended child benefit?",
        nn: "Deler de utvida barnetrygd?",
      },
    },
    viDeler: {
      nb: "Ja, vi deler likt",
      en: "Yes, we share equally",
      nn: "Ja, vi deler likt",
    },
  },
});
