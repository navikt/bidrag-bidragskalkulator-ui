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
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { usePrivatAvtaleForm } from "../PrivatAvtaleFormProvider";

export function OppsummeringAvtaledetaljer() {
  const { form } = usePrivatAvtaleForm();
  const { t } = useOversettelse();
  const { nyAvtale, fraDato, medInnkreving } = form.value();

  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">
          {t(tekster.avtaledetaljerTittel)}
        </FormSummaryHeading>
        <FormSummaryEditLink
          as={Link}
          to={RouteConfig.PRIVAT_AVTALE.STEG_3_AVTALEDETALJER}
        >
          {t(tekster.endreSvar)}
        </FormSummaryEditLink>
      </FormSummaryHeader>
      <FormSummaryAnswers>
        <FormSummaryAnswer>
          <FormSummaryLabel>{t(tekster.avtaleFra)}</FormSummaryLabel>
          <FormSummaryValue>
            {fraDato || t(tekster.ikkeUtfylt)}
          </FormSummaryValue>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>{t(tekster.nyAvtale)}</FormSummaryLabel>
          <FormSummaryValue>
            {nyAvtale === "true"
              ? t(tekster.ja)
              : nyAvtale === "false"
                ? t(tekster.nei)
                : t(tekster.ikkeUtfylt)}
          </FormSummaryValue>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>{t(tekster.oppgjørsform)}</FormSummaryLabel>
          <FormSummaryValue>
            {medInnkreving === "true"
              ? t(tekster.innkrevingGjennomNav)
              : medInnkreving === "false"
                ? t(tekster.privatOppgjor)
                : t(tekster.ikkeUtfylt)}
          </FormSummaryValue>
        </FormSummaryAnswer>
      </FormSummaryAnswers>
    </FormSummary>
  );
}

const tekster = definerTekster({
  avtaledetaljerTittel: {
    nb: "Avtaledetaljer",
    nn: "Avtaledetaljar",
    en: "Agreement details",
  },
  avtaleFra: {
    nb: "Avtalen gjelder fra",
    nn: "Avtalen gjeld frå",
    en: "Agreement valid from",
  },
  nyAvtale: {
    nb: "Ny avtale",
    nn: "Ny avtale",
    en: "New agreement",
  },
  oppgjørsform: {
    nb: "Oppgjørsform",
    nn: "Oppgjerstype",
    en: "Payment arrangement",
  },
  innkrevingGjennomNav: {
    nb: "Gjennom Skatteetaten v/Nav Innkreving",
    nn: "Gjennom Skatteetaten v/Nav Innkreving",
    en: "Through the Tax Administration via NAV Collection",
  },
  privatOppgjor: {
    nb: "Privat oppgjør",
    nn: "Privat oppgjer",
    en: "Private settlement",
  },
  ja: {
    nb: "Ja",
    nn: "Ja",
    en: "Yes",
  },
  nei: {
    nb: "Nei",
    nn: "Nei",
    en: "No",
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
