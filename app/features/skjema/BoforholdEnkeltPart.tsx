import { UNSAFE_Combobox } from "@navikt/ds-react";
import { useFormContext } from "@rvf/react";
import { useEffect, useState } from "react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { FormattertTallTextField } from "../../components/ui/FormattertTallTextField";
import type { BarnebidragSkjema } from "./schema";
import { sporKalkulatorSpørsmålBesvart } from "./utils";

type BoforholdAlternativ = "voksen" | "barn-fast" | "barn-delt";

type Props = {
  part: "deg" | "medforelder";
};

export const BoforholdEnkeltPart = ({ part }: Props) => {
  const form = useFormContext<BarnebidragSkjema>();
  const { t } = useOversettelse();

  const skjemagruppe =
    part === "deg" ? "dittBoforhold" : "medforelderBoforhold";

  const borMedAnnenVoksen =
    form.field(`${skjemagruppe}.borMedAnnenVoksen`).value() === "true";
  const borMedAndreBarn =
    form.field(`${skjemagruppe}.borMedAndreBarn`).value() === "true";

  // State for valgte alternativer
  const [valgteAlternativer, setValgteAlternativer] = useState<
    BoforholdAlternativ[]
  >([]);

  // Initialiser valgte alternativer fra skjemaverdier
  useEffect(() => {
    const alternativer: BoforholdAlternativ[] = [];
    if (borMedAnnenVoksen) alternativer.push("voksen");
    if (borMedAndreBarn) {
      // Sjekk om det er verdier for enten fast eller delt bosted
      const antallFast = form
        .field(`${skjemagruppe}.antallBarnBorFast`)
        .value();
      const antallDelt = form
        .field(`${skjemagruppe}.antallBarnDeltBosted`)
        .value();

      if (antallFast && Number(antallFast) > 0) alternativer.push("barn-fast");
      if (antallDelt && Number(antallDelt) > 0) alternativer.push("barn-delt");
    }
    setValgteAlternativer(alternativer);
  }, []); // Kjør kun ved mount

  const alleAlternativer: { value: BoforholdAlternativ; label: string }[] = [
    {
      value: "voksen",
      label: t(tekster[skjemagruppe].alternativer.voksen),
    },
    {
      value: "barn-fast",
      label: t(tekster[skjemagruppe].alternativer.barnFast),
    },
    {
      value: "barn-delt",
      label: t(tekster[skjemagruppe].alternativer.barnDelt),
    },
  ];

  const håndterToggleAlternativ = (
    alternativ: BoforholdAlternativ,
    erValgt: boolean,
  ) => {
    let nyeValgteAlternativer: BoforholdAlternativ[];

    if (erValgt) {
      nyeValgteAlternativer = [...valgteAlternativer, alternativ];
    } else {
      nyeValgteAlternativer = valgteAlternativer.filter(
        (a) => a !== alternativ,
      );
    }

    setValgteAlternativer(nyeValgteAlternativer);

    // Oppdater skjemaverdier basert på valg
    const harVoksen = nyeValgteAlternativer.includes("voksen");
    const harBarnFast = nyeValgteAlternativer.includes("barn-fast");
    const harBarnDelt = nyeValgteAlternativer.includes("barn-delt");

    form.setValue(
      `${skjemagruppe}.borMedAnnenVoksen`,
      harVoksen ? "true" : "false",
    );
    form.setValue(
      `${skjemagruppe}.borMedAndreBarn`,
      harBarnFast || harBarnDelt ? "true" : "false",
    );

    // Nullstill inputfelt hvis alternativer fjernes
    if (!harBarnFast) {
      form.setValue(`${skjemagruppe}.antallBarnBorFast`, "");
    }
    if (!harBarnDelt) {
      form.setValue(`${skjemagruppe}.antallBarnDeltBosted`, "");
    }

    // Spor analytics
    // sporHendelse({
    //   hendelsetype: "skjema spørsmål besvart",
    //   skjemaId: "barnebidragskalkulator-under-18",
    //   spørsmålId: `${part}-boforhold-combobox`,
    //   spørsmål: t(tekster[skjemagruppe].label),
    // });
  };

  const visBarnFastInput = valgteAlternativer.includes("barn-fast");
  const visBarnDeltInput = valgteAlternativer.includes("barn-delt");

  return (
    <fieldset className="p-0 flex flex-col gap-4">
      <legend className="sr-only">{t(tekster[skjemagruppe].tittel)}</legend>

      <UNSAFE_Combobox
        label={t(tekster[skjemagruppe].label)}
        description={t(tekster[skjemagruppe].beskrivelse)}
        options={alleAlternativer}
        selectedOptions={valgteAlternativer.map(
          (val) => alleAlternativer.find((a) => a.value === val)?.label || val,
        )}
        onToggleSelected={(alternativ: string, erValgt: boolean) =>
          håndterToggleAlternativ(alternativ as BoforholdAlternativ, erValgt)
        }
        isMultiSelect
        error={
          form.field(`${skjemagruppe}.borMedAnnenVoksen`).error() ||
          form.field(`${skjemagruppe}.borMedAndreBarn`).error()
        }
      />

      {visBarnFastInput && (
        <FormattertTallTextField
          {...form.field(`${skjemagruppe}.antallBarnBorFast`).getControlProps()}
          label={t(tekster[skjemagruppe].antallBarnBorFast.label)}
          error={form.field(`${skjemagruppe}.antallBarnBorFast`).error()}
          description={t(
            tekster[skjemagruppe].antallBarnBorFast.inputBeskrivelse,
          )}
          onBlur={sporKalkulatorSpørsmålBesvart(
            `${part}-antall-barn-bor-fast`,
            t(tekster[skjemagruppe].antallBarnBorFast.label),
          )}
          htmlSize={8}
        />
      )}

      {visBarnDeltInput && (
        <FormattertTallTextField
          {...form
            .field(`${skjemagruppe}.antallBarnDeltBosted`)
            .getControlProps()}
          label={t(tekster[skjemagruppe].antallBarnDeltBosted.label)}
          error={form.field(`${skjemagruppe}.antallBarnDeltBosted`).error()}
          description={t(
            tekster[skjemagruppe].antallBarnDeltBosted.inputBeskrivelse,
          )}
          onBlur={sporKalkulatorSpørsmålBesvart(
            `${part}-antall-barn-bor-delt-bosted`,
            t(tekster[skjemagruppe].antallBarnDeltBosted.label),
          )}
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
    label: {
      nb: "Bor du med:",
      nn: "Bur du med:",
      en: "Do you live with:",
    },
    beskrivelse: {
      nb: "Barn du har lagt inn tidligere i kalkulatoren, skal ikke telles med her.",
      nn: "Barn du har lagt inn tidlegare i kalkulatoren, skal du ikkje telje med her.",
      en: "Children you have previously entered in the calculator should not be included here.",
    },
    alternativer: {
      voksen: {
        nb: "En annen voksen",
        nn: "Ein annan vaksen",
        en: "Another adult",
      },
      barnFast: {
        nb: "Barn under 18 som bor fast",
        nn: "Barn under 18 som bur fast",
        en: "Children under 18 living permanently",
      },
      barnDelt: {
        nb: "Barn under 18 med delt bosted",
        nn: "Barn under 18 med delt bustad",
        en: "Children under 18 with shared residence",
      },
    },
    antallBarnBorFast: {
      label: {
        nb: "Antall barn som bor fast hos deg",
        nn: "Antal barn som bur fast hos deg",
        en: "Number of children living permanently with you",
      },
      inputBeskrivelse: {
        nb: "",
        nn: "",
        en: "",
      },
    },
    antallBarnDeltBosted: {
      label: {
        nb: "Antall barn med delt bosted hos deg",
        nn: "Antal barn med delt bustad hos deg",
        en: "Number of children with shared residence with you",
      },
      inputBeskrivelse: {
        nb: "",
        nn: "",
        en: "",
      },
    },
  },
  medforelderBoforhold: {
    tittel: {
      nb: "Den andre forelderen sin bosituasjon",
      en: "The other parent's housing situation",
      nn: "Den andre forelderen sin busituasjon",
    },
    label: {
      nb: "Bor den andre forelderen med:",
      nn: "Bur den andre forelderen med:",
      en: "Does the other parent live with:",
    },
    beskrivelse: {
      nb: "Barn du har lagt inn tidligere i kalkulatoren, skal ikke telles med her.",
      nn: "Barn du har lagt inn tidlegare i kalkulatoren, skal du ikkje telje med her.",
      en: "Children you have previously entered in the calculator should not be included here.",
    },
    alternativer: {
      voksen: {
        nb: "En annen voksen",
        nn: "Ein annan vaksen",
        en: "Another adult",
      },
      barnFast: {
        nb: "Barn under 18 som bor fast",
        nn: "Barn under 18 som bur fast",
        en: "Children under 18 living permanently",
      },
      barnDelt: {
        nb: "Barn under 18 med delt bosted",
        nn: "Barn under 18 med delt bustad",
        en: "Children under 18 with shared residence",
      },
    },
    antallBarnBorFast: {
      label: {
        nb: "Antall egne barn under 18 år som bor fast hos den andre forelderen",
        nn: "Antal eigne barn under 18 år som bur fast hos den andre forelderen",
        en: "Number of own children under 18 years, with permanent residence living with the other parent",
      },
      inputBeskrivelse: {
        nb: "",
        nn: "",
        en: "",
      },
    },
    antallBarnDeltBosted: {
      label: {
        nb: "Antall egne barn under 18 år med delt bosted hos den andre forelderen",
        nn: "Antal eigne barn under 18 år med delt bustad hos den andre forelderen",
        en: "Number of own children under 18 years, with shared permanent residence living with the other parent",
      },
      inputBeskrivelse: {
        nb: "",
        nn: "",
        en: "",
      },
    },
  },
});
