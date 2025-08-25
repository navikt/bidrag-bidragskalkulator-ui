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

export const OppsummeringVedlegg = () => {
  const skjemaverdier = useOppsummeringsdata();
  const { t } = useOversettelse();

  const { harVedlegg } = skjemaverdier.steg5 ?? {};

  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">
          {t(tekster.vedleggTittel)}
        </FormSummaryHeading>
        <FormSummaryEditLink
          as={Link}
          to={RouteConfig.PRIVAT_AVTALE.STEG_5_VEDLEGG}
        >
          {t(tekster.endreSvar)}
        </FormSummaryEditLink>
      </FormSummaryHeader>

      <FormSummaryAnswers>
        <FormSummaryAnswer>
          <FormSummaryLabel>{t(tekster.harVedlegg.label)}</FormSummaryLabel>
          <FormSummaryValue>
            {harVedlegg === "true"
              ? t(tekster.harVedlegg.true)
              : harVedlegg === "false"
                ? t(tekster.harVedlegg.false)
                : t(tekster.ikkeUtfylt)}
          </FormSummaryValue>
        </FormSummaryAnswer>
      </FormSummaryAnswers>
    </FormSummary>
  );
};

const tekster = definerTekster({
  vedleggTittel: {
    nb: "Vedlegg",
    en: "Attachments",
    nn: "Vedlegg",
  },
  harVedlegg: {
    label: {
      nb: "Har du noen annen dokumentasjon du ønsker å legge ved?",
      nn: "Har du nokon annan dokumentasjon som du ønsker å legge ved?",
      en: "Do you have any other documentation you would like to submit?",
    },
    true: {
      nb: "Jeg legger det ved dette skjemaet",
      nn: "Eg legg det ved dette skjemaet",
      en: "I am attaching it to this form",
    },
    false: {
      nb: "Nei, jeg har ingen ekstra dokumentasjon jeg vil legge ved",
      nn: "Nei, eg har ingen ekstra dokumentasjon eg vil legge ved",
      en: "No, I have no additional documentation to attach",
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
