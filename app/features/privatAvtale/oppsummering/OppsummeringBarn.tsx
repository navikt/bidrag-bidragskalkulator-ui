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
import type { PrivatAvtaleSkjema } from "../skjemaSchema";

export function OppsummeringBarn() {
  const { form } = usePrivatAvtaleForm();
  const { t } = useOversettelse();
  const { barn } = form.value();

  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">
          {t(tekster.barnTittel)}
        </FormSummaryHeading>
        <FormSummaryEditLink
          as={Link}
          to={RouteConfig.PRIVAT_AVTALE.STEG_2_BARN_OG_BIDRAG}
        >
          {t(tekster.endreSvar)}
        </FormSummaryEditLink>
      </FormSummaryHeader>
      <FormSummaryAnswers>
        {barn.length === 1 ? (
          <Barnesvar barn={barn[0]} />
        ) : (
          barn.map((barn, i) => (
            <FormSummaryAnswer key={i}>
              <FormSummaryLabel>
                {t(tekster.barnLabel)} {i + 1}
              </FormSummaryLabel>
              <FormSummaryValue>
                <Barnesvar barn={barn} />
              </FormSummaryValue>
            </FormSummaryAnswer>
          ))
        )}
      </FormSummaryAnswers>
    </FormSummary>
  );
}

type BarnesvarProps = {
  barn: PrivatAvtaleSkjema["barn"][number];
};

const Barnesvar = ({ barn }: BarnesvarProps) => {
  const { t } = useOversettelse();
  return (
    <FormSummaryAnswers>
      <FormSummaryAnswer>
        <FormSummaryLabel>{t(tekster.fulltNavn)}</FormSummaryLabel>
        <FormSummaryValue>
          {barn.fulltNavn || t(tekster.ikkeUtfylt)}
        </FormSummaryValue>
      </FormSummaryAnswer>
      <FormSummaryAnswer>
        <FormSummaryLabel>{t(tekster.ident)}</FormSummaryLabel>
        <FormSummaryValue>
          {barn.ident || t(tekster.ikkeUtfylt)}
        </FormSummaryValue>
      </FormSummaryAnswer>
      <FormSummaryAnswer>
        <FormSummaryLabel>{t(tekster.bidragstype)}</FormSummaryLabel>
        <FormSummaryValue>
          {barn.bidragstype || t(tekster.ikkeUtfylt)}
        </FormSummaryValue>
      </FormSummaryAnswer>
      <FormSummaryAnswer>
        <FormSummaryLabel>{t(tekster.belopPerManed)}</FormSummaryLabel>
        <FormSummaryValue>{barn.sum || t(tekster.ikkeUtfylt)}</FormSummaryValue>
      </FormSummaryAnswer>
    </FormSummaryAnswers>
  );
};

const tekster = definerTekster({
  barnTittel: {
    nb: "Felles barn og barnebidrag",
    nn: "Felles barn og barnebidrag",
    en: "Shared children and child support",
  },
  barnLabel: {
    nb: "Barn",
    nn: "Barn",
    en: "Child",
  },
  bidragstype: {
    nb: "Bidragstype",
    nn: "Bidragstype",
    en: "Contribution type",
  },
  belopPerManed: {
    nb: "Beløp per måned",
    nn: "Beløp per månad",
    en: "Amount per month",
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
