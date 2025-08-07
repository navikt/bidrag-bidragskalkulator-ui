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
import type { PrivatAvtaleFlerstegsSkjema } from "../skjemaSchema";

export function OppsummeringBarn() {
  const { form } = usePrivatAvtaleForm();
  const { t } = useOversettelse();
  const skjemaverdier = form.value();
  const { barn } = skjemaverdier.steg2;
  const { medforelder } = skjemaverdier.steg1;

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
          <Barnesvar barn={barn[0]} navnMedforelder={medforelder?.fulltNavn} />
        ) : (
          barn.map((barn, i) => (
            <FormSummaryAnswer key={i}>
              <FormSummaryLabel>
                {t(tekster.barnLabel)} {i + 1}
              </FormSummaryLabel>
              <FormSummaryValue>
                <FormSummaryAnswers>
                  <Barnesvar
                    barn={barn}
                    navnMedforelder={medforelder?.fulltNavn}
                  />
                </FormSummaryAnswers>
              </FormSummaryValue>
            </FormSummaryAnswer>
          ))
        )}
      </FormSummaryAnswers>
    </FormSummary>
  );
}

type BarnesvarProps = {
  barn: PrivatAvtaleFlerstegsSkjema["steg2"]["barn"][number];
  navnMedforelder?: string;
};

const Barnesvar = ({ barn, navnMedforelder = "" }: BarnesvarProps) => {
  const { t } = useOversettelse();
  return (
    <>
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
        <FormSummaryLabel>{t(tekster.bidragstype.label)}</FormSummaryLabel>
        <FormSummaryValue>
          {barn.bidragstype
            ? t(tekster.bidragstype[barn.bidragstype](navnMedforelder))
            : t(tekster.ikkeUtfylt)}
        </FormSummaryValue>
      </FormSummaryAnswer>
      <FormSummaryAnswer>
        <FormSummaryLabel>{t(tekster.belopPerManed)}</FormSummaryLabel>
        <FormSummaryValue>{barn.sum || t(tekster.ikkeUtfylt)}</FormSummaryValue>
      </FormSummaryAnswer>
    </>
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
    label: {
      nb: "Skal du motta eller betale barnebidrag?",
      en: "Will you receive or pay child support?",
      nn: "Skal du motta eller betale barnebidrag?",
    },
    MOTTAKER: (navnMotpart) => ({
      nb: `Jeg skal motta barnebidrag fra ${navnMotpart || "den andre forelderen"}`,
      en: `I will receive child support from ${navnMotpart || "the other parent"}`,
      nn: `Eg skal motta barnebidrag frå ${navnMotpart || "den andre forelderen"}`,
    }),
    PLIKTIG: (navnMotpart) => ({
      nb: `Jeg skal betale barnebidrag til ${navnMotpart || "den andre forelderen"}`,
      en: `I will pay child support to ${navnMotpart || "the other parent"}`,
      nn: `Eg skal betale barnebidrag til ${navnMotpart || "den andre forelderen"}`,
    }),
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
