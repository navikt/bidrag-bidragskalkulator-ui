import { BodyShort, Radio, RadioGroup, Stack } from "@navikt/ds-react";
import { useFormContext, useFormScope } from "@rvf/react";
import { FormattertTallTextField } from "~/components/ui/FormattertTallTextField";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import {
  MAKS_ALDER_BARNETILSYNSUTGIFT,
  type BarnebidragSkjema,
} from "../schema";

type Props = {
  barnIndex: number;
  bidragstype: "MOTTAKER" | "PLIKTIG";
};

export const BarnepassPerBarn = ({ barnIndex, bidragstype }: Props) => {
  const form = useFormContext<BarnebidragSkjema>();
  const { t } = useOversettelse();

  const barnField = useFormScope(form.scope(`barn[${barnIndex}]`));
  const alder = barnField.value().alder;

  if (alder === "") {
    return null;
  }

  const visSpørsmålOmBarnetilsynsutgift =
    barnField.field("alder").touched() &&
    Number(alder) <= MAKS_ALDER_BARNETILSYNSUTGIFT;

  if (!visSpørsmålOmBarnetilsynsutgift) {
    return null;
  }

  return (
    <>
      <BodyShort>{t(tekster.barnAlder(alder))}</BodyShort>

      <RadioGroup
        legend={t(tekster[bidragstype].barnepassUtgifter)}
        {...barnField.getControlProps("harBarnetilsynsutgift")}
        error={barnField.error("harBarnetilsynsutgift")}
      >
        <Stack
          gap="space-0 space-24"
          direction={{ xs: "column", sm: "row" }}
          wrap={false}
        >
          <Radio value="true">{t(tekster.jaNei.ja)}</Radio>
          <Radio value="false">{t(tekster.jaNei.nei)}</Radio>
        </Stack>
      </RadioGroup>

      {barnField.value("harBarnetilsynsutgift") === "true" && (
        <RadioGroup
          legend={t(tekster[bidragstype].mottarStønadTilBarnetilsyn)}
          {...barnField.getControlProps("mottarStønadTilBarnetilsyn")}
          error={barnField.error("mottarStønadTilBarnetilsyn")}
          className="pl-8"
        >
          <Stack
            gap="space-0 space-24"
            direction={{ xs: "column", sm: "row" }}
            wrap={false}
          >
            <Radio value="true">{t(tekster.jaNei.ja)}</Radio>
            <Radio value="false">{t(tekster.jaNei.nei)}</Radio>
          </Stack>
        </RadioGroup>
      )}

      {barnField.value("mottarStønadTilBarnetilsyn") === "true" && (
        <RadioGroup
          legend={t(tekster.barnepassType.spørsmål)}
          {...barnField.getControlProps("barnepassSituasjon")}
          error={barnField.error("barnepassSituasjon")}
          className="pl-8"
        >
          <Stack
            gap="space-0 space-24"
            direction={{ xs: "column", sm: "row" }}
            wrap={false}
          >
            <Radio value="HELTID">{t(tekster.barnepassType.heltid)}</Radio>
            <Radio value="DELTID">{t(tekster.barnepassType.deltid)}</Radio>
          </Stack>
        </RadioGroup>
      )}

      {barnField.value("mottarStønadTilBarnetilsyn") === "false" && (
        <FormattertTallTextField
          {...barnField.getControlProps("barnetilsynsutgift")}
          label={t(tekster[bidragstype].barnepassUtgifterBeløp)}
          error={barnField.field("barnetilsynsutgift").error()}
          htmlSize={10}
          className="pl-8"
        />
      )}
    </>
  );
};

const tekster = definerTekster({
  MOTTAKER: {
    barnepassUtgifter: {
      nb: "Har du utgifter til barnepass for dette barnet?",
      en: "",
      nn: "",
    },
    mottarStønadTilBarnetilsyn: {
      nb: "Mottar du pengestøtte til barnepass? (Stønad til barnetilsyn)",
      en: "",
      nn: "",
    },
    barnepassUtgifterBeløp: {
      nb: "Hvor mye betaler du for barnepass per måned?",
      en: "",
      nn: "",
    },
  },
  PLIKTIG: {
    barnepassUtgifter: {
      nb: "Har bidragsmottaker utgifter til barnepass for dette barnet?",
      en: "",
      nn: "",
    },
    mottarStønadTilBarnetilsyn: {
      nb: "Mottar bidragsmottaker pengestøtte til barnepass? (Stønad til barnetilsyn)",
      en: "",
      nn: "",
    },
    barnepassUtgifterBeløp: {
      nb: "Hvor mye betaler bidragsmottaker for barnepass per måned?",
      en: "",
      nn: "",
    },
  },
  barnepassType: {
    spørsmål: {
      nb: "Heltid eller deltid plass? ",
      en: "",
      nn: "",
    },
    heltid: {
      nb: "Heltid",
      en: "",
      nn: "",
    },
    deltid: {
      nb: "Deltid",
      en: "",
      nn: "",
    },
  },
  jaNei: {
    ja: {
      nb: "Ja",
      en: "",
      nn: "",
    },
    nei: {
      nb: "Nei",
      en: "",
      nn: "",
    },
  },
  barnAlder: (alder) => ({
    nb: `Barn ${alder} år`,
    en: `Child ${alder} years`,
    nn: `Barn ${alder} år`,
  }),
});
