import { Heading, Radio, RadioGroup } from "@navikt/ds-react";
import { useFormContext, useFormScope } from "@rvf/react";
import { FormattertTallTextField } from "~/components/ui/FormattertTallTextField";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import {
  MAKS_ALDER_BARNETILSYNSUTGIFT,
  type BarnebidragSkjema,
} from "../schema";

type Props = {
  barnIndex: number;
};

export const BarnepassPerBarn = ({ barnIndex }: Props) => {
  const form = useFormContext<BarnebidragSkjema>();
  const { t } = useOversettelse();

  const barnField = useFormScope(form.scope(`barn[${barnIndex}]`));
  const alder = barnField.value().alder;
  const harUtgifter = barnField.value().harBarnepassutgift === "true";
  const mottarStønad = barnField.value().mottarStønadTilBarnepass;
  const visSpørsmålOmBarnetilsynsutgift =
    barnField.field("alder").touched() &&
    Number(alder) <= MAKS_ALDER_BARNETILSYNSUTGIFT;

  if (!visSpørsmålOmBarnetilsynsutgift) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Heading level="3" size="small" spacing>
        {t(tekster.barn)} {alder ? `${alder} ${t(tekster.år)}` : ""}
      </Heading>

      <RadioGroup
        {...barnField.getInputProps("harBarnepassutgift")}
        legend={t(tekster.harUtgifter.spørsmål)}
        description={t(tekster.harUtgifter.beskrivelse)}
        error={barnField.field("harBarnepassutgift").error()}
      >
        <Radio value="true">{t(tekster.felles.ja)}</Radio>
        <Radio value="false">{t(tekster.felles.nei)}</Radio>
      </RadioGroup>

      {harUtgifter && (
        <div className="space-y-4">
          <RadioGroup
            {...barnField.getInputProps("mottarStønadTilBarnepass")}
            legend={t(tekster.mottarStønad.spørsmål)}
            error={barnField.field("mottarStønadTilBarnepass").error()}
          >
            <Radio value="true">{t(tekster.felles.ja)}</Radio>
            <Radio value="false">{t(tekster.felles.nei)}</Radio>
          </RadioGroup>

          {mottarStønad === "true" && (
            <RadioGroup
              {...barnField.getInputProps("barnepassPlass")}
              legend={t(tekster.plass.spørsmål)}
              description={t(tekster.plass.hjelpetekst)}
              error={barnField.field("barnepassPlass").error()}
            >
              <Radio value="HELTID">{t(tekster.plass.valg.heltid)}</Radio>
              <Radio value="DELTID">{t(tekster.plass.valg.deltid)}</Radio>
            </RadioGroup>
          )}

          {mottarStønad === "false" && (
            <FormattertTallTextField
              {...barnField.getControlProps("barnetilsynsutgift")}
              label={t(tekster.utgift.label)}
              error={barnField.field("barnetilsynsutgift").error()}
              description={t(tekster.utgift.hjelpetekst)}
              htmlSize={15}
            />
          )}
        </div>
      )}
    </div>
  );
};

const tekster = definerTekster({
  barn: {
    nb: "Barn",
    en: "Child",
    nn: "Barn",
  },
  år: {
    nb: "år",
    en: "years",
    nn: "år",
  },
  harUtgifter: {
    spørsmål: {
      nb: "Har du utgifter til barnepass?",
      en: "Do you have childcare expenses?",
      nn: "Har du utgifter til barnepass?",
    },
    beskrivelse: {
      nb: "(barnehage, SFO, dagmamma osv.)",
      en: "(kindergarten, after-school care, childminder, etc.)",
      nn: "(barnehage, SFO, dagmamma osv.)",
    },
  },
  mottarStønad: {
    spørsmål: {
      nb: "Får du stønad til barnepass fra Nav?",
      en: "Do you receive childcare support from Nav?",
      nn: "Får du stønad til barnepass frå Nav?",
    },
  },
  plass: {
    spørsmål: {
      nb: "Heltid eller deltid plass?",
      en: "Full-time or part-time place?",
      nn: "Heiltid eller deltid plass?",
    },
    valg: {
      heltid: {
        nb: "Heltid",
        en: "Full-time",
        nn: "Heiltid",
      },
      deltid: {
        nb: "Deltid",
        en: "Part-time",
        nn: "Deltid",
      },
    },
    hjelpetekst: {
      nb: "Barnehage: Heltid = 33+ timer/uke, Deltid ≤ 32 timer. SFO: Heltid = 11 timer/uke, Deltid ≤ 10 timer",
      en: "Kindergarten: Full-time = 33+ hours/week, Part-time ≤ 32 hours. After-school: Full-time = 11 hours/week, Part-time ≤ 10 hours",
      nn: "Barnehage: Heiltid = 33+ timar/veke, Deltid ≤ 32 timar. SFO: Heiltid = 11 timar/veke, Deltid ≤ 10 timar",
    },
  },
  utgift: {
    label: {
      nb: "Hvor mye betaler du per måned?",
      en: "How much do you pay per month?",
      nn: "Kor mykje betaler du per månad?",
    },
    hjelpetekst: {
      nb: "Oppgi det du faktisk betaler selv",
      en: "Enter what you actually pay yourself",
      nn: "Oppgi det du faktisk betaler sjølv",
    },
  },
  felles: {
    ja: { nb: "Ja", en: "Yes", nn: "Ja" },
    nei: { nb: "Nei", en: "No", nn: "Nei" },
  },
});
