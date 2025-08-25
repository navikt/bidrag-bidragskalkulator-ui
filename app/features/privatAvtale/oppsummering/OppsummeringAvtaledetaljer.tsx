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
import { teksterAvtaledetaljer } from "../tekster/avtaledetaljer";

export function OppsummeringAvtaledetaljer() {
  const { t } = useOversettelse();
  const skjemaverdier = useOppsummeringsdata();

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
          <FormSummaryLabel>
            {t(teksterAvtaledetaljer.nyAvtale.label)}
          </FormSummaryLabel>
          <FormSummaryValue>
            {skjemaverdier.steg3?.avtaledetaljer?.nyAvtale === "true"
              ? t(teksterAvtaledetaljer.nyAvtale.true)
              : skjemaverdier.steg3?.avtaledetaljer?.nyAvtale === "false"
                ? t(teksterAvtaledetaljer.nyAvtale.false)
                : t(tekster.ikkeUtfylt)}
          </FormSummaryValue>
        </FormSummaryAnswer>

        {skjemaverdier.steg3?.avtaledetaljer?.nyAvtale === "false" && (
          <FormSummaryAnswer>
            <FormSummaryLabel>
              {t(teksterAvtaledetaljer.oppgjørsformIdag.label)}
            </FormSummaryLabel>
            <FormSummaryValue>
              {skjemaverdier.steg3?.avtaledetaljer?.oppgjørsformIdag === ""
                ? t(tekster.ikkeUtfylt)
                : t(
                    teksterAvtaledetaljer.oppgjørsformIdag[
                      skjemaverdier.steg3?.avtaledetaljer?.oppgjørsformIdag
                    ],
                  )}
            </FormSummaryValue>
          </FormSummaryAnswer>
        )}

        <FormSummaryAnswer>
          <FormSummaryLabel>
            {t(teksterAvtaledetaljer.medInnkreving.label)}
          </FormSummaryLabel>
          <FormSummaryValue>
            {skjemaverdier.steg3?.avtaledetaljer?.medInnkreving === "true"
              ? t(teksterAvtaledetaljer.medInnkreving.true)
              : skjemaverdier.steg3?.avtaledetaljer?.medInnkreving === "false"
                ? t(teksterAvtaledetaljer.medInnkreving.false)
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
