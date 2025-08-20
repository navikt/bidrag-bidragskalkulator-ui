import { FormSummary } from "@navikt/ds-react";
import {
  FormSummaryAnswer,
  FormSummaryAnswers,
  FormSummaryEditLink,
  FormSummaryHeader,
  FormSummaryHeading,
  FormSummaryLabel,
  FormSummaryValue,
} from "@navikt/ds-react/FormSummary";
import { Link } from "react-router";
import { RouteConfig } from "~/config/routeConfig";
import { useOppsummeringsdata } from "~/routes/privat-avtale/steg/oppsummering-og-avtale";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export const OppsummeringAndreBestemmelser = () => {
  const skjemaverdier = useOppsummeringsdata();
  const { t } = useOversettelse();

  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">
          {t(tekster.andreBestemmelserTittel)}
        </FormSummaryHeading>
        <FormSummaryEditLink
          as={Link}
          to={RouteConfig.PRIVAT_AVTALE.STEG_4_ANDRE_BESTEMMELSER}
        >
          {t(tekster.endreSvar)}
        </FormSummaryEditLink>
      </FormSummaryHeader>

      <FormSummaryAnswers>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            {t(tekster.erAndreBestemmelser.label)}
          </FormSummaryLabel>
          <FormSummaryValue>
            {skjemaverdier.steg4?.erAndreBestemmelser === "true"
              ? t(tekster.erAndreBestemmelser.true)
              : skjemaverdier.steg4?.erAndreBestemmelser === "false"
                ? t(tekster.erAndreBestemmelser.false)
                : t(tekster.ikkeUtfylt)}
          </FormSummaryValue>
        </FormSummaryAnswer>

        {skjemaverdier.steg4?.erAndreBestemmelser === "true" && (
          <FormSummaryAnswer>
            <FormSummaryLabel>
              {t(tekster.andreBestemmelser.label)}
            </FormSummaryLabel>
            <FormSummaryValue>
              {skjemaverdier.steg4?.andreBestemmelser || t(tekster.ikkeUtfylt)}
            </FormSummaryValue>
          </FormSummaryAnswer>
        )}
      </FormSummaryAnswers>
    </FormSummary>
  );
};

const tekster = definerTekster({
  andreBestemmelserTittel: {
    nb: "Andre bestemmelser",
    nn: "Andre bestemmingar",
    en: "Other conditions",
  },
  erAndreBestemmelser: {
    label: {
      nb: "Er det andre bestemmelser tilknyttet avtalen?",
      nn: "Er det knytt andre bestemmingar til avtalen?",
      en: "Are there any other conditions that apply to the agreement?",
    },
    true: {
      nb: "Ja",
      nn: "Ja",
      en: "Yes",
    },
    false: {
      nb: "Nei",
      nn: "Nei",
      en: "No",
    },
  },
  andreBestemmelser: {
    label: {
      nb: "Andre bestemmelser tilknyttet avtalen",
      nn: "Andre bestemmingar knytt til avtalen",
      en: "Other conditions that apply to the agreement",
    },
  },
  ikkeUtfylt: {
    nb: "Ikke utfylt",
    nn: "Ikkje utfylt",
    en: "Not filled in",
  },
  endreSvar: {
    nb: "Endre svar",
    nn: "Endre svar",
    en: "Edit answer",
  },
});
