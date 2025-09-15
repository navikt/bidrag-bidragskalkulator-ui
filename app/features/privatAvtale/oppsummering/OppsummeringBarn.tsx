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
import { datoTilTekst } from "~/utils/dato";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { formatterFødselsnummer } from "~/utils/string";
import type { PrivatAvtaleFlerstegsSkjema } from "../skjemaSchema";

export function OppsummeringBarn() {
  const { t } = useOversettelse();
  const skjemaverdier = useOppsummeringsdata();
  const navnMedforelder = `${skjemaverdier.steg2?.medforelder?.fornavn} ${skjemaverdier.steg2?.medforelder?.etternavn}`;

  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">
          {t(tekster.barnTittel)}
        </FormSummaryHeading>
        <FormSummaryEditLink
          as={Link}
          to={RouteConfig.PRIVAT_AVTALE.STEG_3_BARN_OG_BIDRAG}
        >
          {t(tekster.endreSvar)}
        </FormSummaryEditLink>
      </FormSummaryHeader>
      <FormSummaryAnswers>
        {skjemaverdier.steg3?.barn?.length === 1 ? (
          <Barnesvar
            barn={skjemaverdier.steg3.barn[0]}
            navnMedforelder={navnMedforelder}
          />
        ) : (
          skjemaverdier.steg3?.barn?.map((barn, i) => (
            <FormSummaryAnswer key={i}>
              <FormSummaryLabel>
                {t(tekster.barnLabel)} {i + 1}
              </FormSummaryLabel>
              <FormSummaryValue>
                <FormSummaryAnswers>
                  <Barnesvar barn={barn} navnMedforelder={navnMedforelder} />
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
  barn: PrivatAvtaleFlerstegsSkjema["steg3"]["barn"][number];
  navnMedforelder?: string;
};

const Barnesvar = ({ barn, navnMedforelder = "" }: BarnesvarProps) => {
  const { t } = useOversettelse();
  return (
    <>
      <FormSummaryAnswer>
        <FormSummaryLabel>{t(tekster.fornavn)}</FormSummaryLabel>
        <FormSummaryValue>
          {barn.fornavn || t(tekster.ikkeUtfylt)}
        </FormSummaryValue>
      </FormSummaryAnswer>
      <FormSummaryAnswer>
        <FormSummaryLabel>{t(tekster.etternavn)}</FormSummaryLabel>
        <FormSummaryValue>
          {barn.etternavn || t(tekster.ikkeUtfylt)}
        </FormSummaryValue>
      </FormSummaryAnswer>
      <FormSummaryAnswer>
        <FormSummaryLabel>{t(tekster.ident)}</FormSummaryLabel>
        <FormSummaryValue>
          {formatterFødselsnummer(barn.ident) || t(tekster.ikkeUtfylt)}
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
      <FormSummaryAnswer>
        <FormSummaryLabel>{t(tekster.avtaleFra)}</FormSummaryLabel>
        <FormSummaryValue>
          {barn.fraDato
            ? datoTilTekst(new Date(barn.fraDato))
            : t(tekster.ikkeUtfylt)}
        </FormSummaryValue>
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
  fornavn: {
    nb: "Fornavn",
    nn: "Førenamn",
    en: "First name",
  },
  etternavn: {
    nb: "Etternavn",
    nn: "Etternamn",
    en: "Last name",
  },
  ident: {
    nb: "Fødselsnummer eller D-nummer (11 siffer)",
    en: "National ID or D-number (11 digits)",
    nn: "Fødselsnummer eller D-nummer (11 siffer)",
  },
  avtaleFra: {
    nb: "Avtalen gjelder fra",
    nn: "Avtalen gjeld frå",
    en: "Agreement valid from",
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
