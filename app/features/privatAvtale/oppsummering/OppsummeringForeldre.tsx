import {
  FormSummary,
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

export function OppsummeringForeldre() {
  const { form } = usePrivatAvtaleForm();
  const { t } = useOversettelse();
  const { deg, medforelder } = form.value();

  return (
    <>
      <FormSummary>
        <FormSummaryHeader>
          <FormSummaryHeading level="3">{t(tekster.omDeg)}</FormSummaryHeading>
        </FormSummaryHeader>
        <FormSummaryAnswers>
          <FormSummaryAnswer>
            <FormSummaryLabel>{t(tekster.fulltNavn)}</FormSummaryLabel>
            <FormSummaryValue>
              {deg.fulltNavn || t(tekster.ikkeUtfylt)}
            </FormSummaryValue>
          </FormSummaryAnswer>
          <FormSummaryAnswer>
            <FormSummaryLabel>{t(tekster.ident)}</FormSummaryLabel>
            <FormSummaryValue>
              {deg.ident || t(tekster.ikkeUtfylt)}
            </FormSummaryValue>
          </FormSummaryAnswer>
        </FormSummaryAnswers>
      </FormSummary>
      <FormSummary>
        <FormSummaryHeader>
          <FormSummaryHeading level="3">
            {t(tekster.omMedforelder)}
          </FormSummaryHeading>
          <FormSummaryEditLink
            as={Link}
            to={`${RouteConfig.PRIVAT_AVTALE.STEG_1_FORELDRE}#avtalepart-medforelder`}
          >
            {t(tekster.endreSvar)}
          </FormSummaryEditLink>
        </FormSummaryHeader>
        <FormSummaryAnswers>
          <FormSummaryAnswer>
            <FormSummaryLabel>{t(tekster.fulltNavn)}</FormSummaryLabel>
            <FormSummaryValue>
              {medforelder.fulltNavn || t(tekster.ikkeUtfylt)}
            </FormSummaryValue>
          </FormSummaryAnswer>
          <FormSummaryAnswer>
            <FormSummaryLabel>{t(tekster.ident)}</FormSummaryLabel>
            <FormSummaryValue>
              {medforelder.ident || t(tekster.ikkeUtfylt)}
            </FormSummaryValue>
          </FormSummaryAnswer>
        </FormSummaryAnswers>
      </FormSummary>
    </>
  );
}

const tekster = definerTekster({
  foreldreTittel: {
    nb: "Om deg og den andre forelderen",
    nn: "Om deg og den andre forelderen",
    en: "About you and the other parent",
  },
  omDeg: {
    nb: "Om deg",
    nn: "Om deg",
    en: "About you",
  },
  omMedforelder: {
    nb: "Om den andre forelderen",
    nn: "Om den andre forelderen",
    en: "About the other parent",
  },
  fulltNavn: {
    nb: "Fullt navn",
    nn: "Heile namnet",
    en: "Full name",
  },
  ident: {
    nb: "Fødselsnummer eller D-nummer (11 siffer)",
    en: "National ID or D-number (11 digits)",
    nn: "Fødselsnummer eller D-nummer (11 siffer)",
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
