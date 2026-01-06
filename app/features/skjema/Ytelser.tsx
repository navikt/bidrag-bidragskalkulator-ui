import { BodyShort, Checkbox, CheckboxGroup, Heading } from "@navikt/ds-react";
import { useFormContext } from "@rvf/react";
import { useEffect, useRef, useState } from "react";
import JaNeiRadio from "~/components/ui/JaNeiRadio";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import {
  ALDER_KONTANTSTØTTE,
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
  const harBarnIKontantstøtteAlder = barn.some(
    (b) => Number(b.alder) === ALDER_KONTANTSTØTTE,
  );

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
        mottarUtvidetBarnetrygd: "undefined",
        delerUtvidetBarnetrygd: "undefined",
        mottarSmåbarnstillegg: "undefined",
        kontantstøtte: {
          mottar: "undefined",
          deler: "undefined",
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
      nyeValgteYtelser.includes("utvidet-barnetrygd") ? "true" : "undefined",
    );
    form.setValue(
      "ytelser.mottarSmåbarnstillegg",
      nyeValgteYtelser.includes("småbarnstillegg") ? "true" : "undefined",
    );
    form.setValue(
      "ytelser.kontantstøtte.mottar",
      nyeValgteYtelser.includes("kontantstøtte") ? "true" : "undefined",
    );

    // Nullstill kontantstøtte-beløp hvis kontantstøtte fjernes
    if (!nyeValgteYtelser.includes("kontantstøtte")) {
      form.setValue("ytelser.kontantstøtte", {
        mottar: "undefined",
        deler: "undefined",
        beløp: "",
      });
    }

    // Nullstill deling hvis utvidet barnetrygd fjernes
    if (!nyeValgteYtelser.includes("utvidet-barnetrygd")) {
      form.setValue("ytelser.delerUtvidetBarnetrygd", "undefined");
    }
  };

  if (
    !harBarnUnderUtvidetBarnetrygdAlder &&
    !harBarnUnderSmåbarnstilleggAlder &&
    !harBarnIKontantstøtteAlder
  ) {
    return null;
  }

  const mottarUtvidetBarnetrygd = valgteYtelser.includes("utvidet-barnetrygd");

  return (
    <div className="border p-4 rounded-md">
      <Heading level="2" size="medium" className="pb-4">
        {t(tekster.felles.overskrift)}
      </Heading>
      <fieldset className="p-0 flex flex-col">
        <legend className="sr-only">{t(tekster.felles.overskrift)}</legend>
        <BodyShort className="pb-2">
          {t(tekster[bidragstype].beskrivelse)}
        </BodyShort>

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
    beskrivelse: {
      nb: "Kryss av hvis du har noen av disse støtteordningene og tilleggene",
      en: "Check if you has any of these support schemes and supplements",
      nn: "Kryss av viss du har nokre av desse støtteordningane og tillegga",
    },
    småbarnstillegg: {
      beskrivelse: {
        nb: "Aktuelt hvis forelderen har full overgangsstønad og barn i alderen 0-3 år",
        en: "Relevant if the parent has full transitional benefits and children aged 0-3 years",
        nn: "Aktuelt viss forelderen har full overgangsstønad og barn i alderen 0-3 år",
      },
    },
  },
  PLIKTIG: {
    beskrivelse: {
      nb: "Kryss av hvis den andre forelderen har noen av disse støtteordningene og tilleggene",
      en: "Check if the other parent has any of these support schemes and supplements",
      nn: "Kryss av viss den andre forelderen har nokre av desse støtteordningane og tillegga",
    },
    småbarnstillegg: {
      beskrivelse: {
        nb: "Aktuelt hvis forelderen har full overgangsstønad og barn i alderen 0-3 år",
        en: "Relevant if the parent has full transitional benefits and children aged 0-3 years",
        nn: "Aktuelt viss forelderen har full overgangsstønad og barn i alderen 0-3 år",
      },
    },
  },
  felles: {
    overskrift: {
      nb: "Pengestøtte fra Nav",
      en: "Financial support from NAV",
      nn: "Pengestøtte frå Nav",
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
    },
    utvidetBarnetrygd: {
      delingSpørsmål: {
        nb: "Deler du og den andre forelderen den utvidede barnetrygden?",
        en: "",
        nn: "Deler du og den andre forelderen den utvidede barnetrygden?",
      },
    },
  },
});
