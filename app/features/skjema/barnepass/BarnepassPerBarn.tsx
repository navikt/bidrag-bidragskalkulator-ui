import { BodyShort, Radio, RadioGroup, Stack } from "@navikt/ds-react";
import { useFormContext, useFormScope } from "@rvf/react";
import { FormattertTallTextField } from "~/components/ui/FormattertTallTextField";
import JaNeiRadio from "~/components/ui/JaNeiRadio";
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
      <BodyShort className="font-bold" spacing>
        {t(tekster.barnAlder(alder))}
      </BodyShort>

      <JaNeiRadio
        legend={t(tekster[bidragstype].barnepassUtgifter)}
        {...barnField.getControlProps("harBarnetilsynsutgift")}
        error={barnField.error("harBarnetilsynsutgift")}
      />

      {barnField.value("harBarnetilsynsutgift") === "true" && (
        <JaNeiRadio
          {...barnField.getControlProps("mottarStønadTilBarnetilsyn")}
          legend={t(tekster[bidragstype].mottarStønadTilBarnetilsyn)}
          error={barnField.error("mottarStønadTilBarnetilsyn")}
          className="pl-8"
        />
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
        />
      )}
    </>
  );
};

const tekster = definerTekster({
  MOTTAKER: {
    barnepassUtgifter: {
      nb: "Har du utgifter til barnepass for dette barnet?",
      en: "Do you have expenses for childcare for this child?",
      nn: "Har du utgifter til barnepass for dette barnet?",
    },
    mottarStønadTilBarnetilsyn: {
      nb: "Mottar du pengestøtte til barnepass? (Stønad til barnetilsyn)",
      en: "Do you receive financial support for childcare? (Support for child supervision)",
      nn: "Mottar du pengestøtte til barnepass? (Stønad til barnetilsyn)",
    },
    barnepassUtgifterBeløp: {
      nb: "Hvor mye betaler du for barnepass per måned?",
      en: "How much do you pay for childcare per month?",
      nn: "Kor mykje betaler du for barnepass per månad?",
    },
  },
  PLIKTIG: {
    barnepassUtgifter: {
      nb: "Har den andre forelderen utgifter til barnepass for dette barnet?",
      en: "Has the other parent expenses for childcare for this child?",
      nn: "Har den andre forelderen utgifter til barnepass for dette barnet?",
    },
    mottarStønadTilBarnetilsyn: {
      nb: "Mottar den andre forelderen pengestøtte til barnepass? (Stønad til barnetilsyn)",
      en: "Does the other parent receive financial support for childcare? (Support for child supervision)",
      nn: "Mottar den andre forelderen pengestøtte til barnepass? (Stønad til barnetilsyn)",
    },
    barnepassUtgifterBeløp: {
      nb: "Hvor mye betaler den andre forelderen for barnepass per måned?",
      en: "How much does the other parent pay for childcare per month?",
      nn: "Kor mykje betaler den andre forelderen for barnepass per månad?",
    },
  },
  barnepassType: {
    spørsmål: {
      nb: "Heltid eller deltid plass? ",
      en: "Full-time or part-time place?",
      nn: "Heltid eller deltid plass?",
    },
    heltid: {
      nb: "Heltid",
      en: "Full-time",
      nn: "Heltid",
    },
    deltid: {
      nb: "Deltid",
      en: "Part-time",
      nn: "Deltid",
    },
  },
  barnAlder: (alder) => ({
    nb: `Barn ${alder} år`,
    en: `Child ${alder} years`,
    nn: `Barn ${alder} år`,
  }),
});
