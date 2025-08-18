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
import { useFormScope } from "@rvf/react";
import { Link } from "react-router";
import { RouteConfig } from "~/config/routeConfig";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { teksterAvtaledetaljer } from "../Avtaledetaljer";
import { usePrivatAvtaleForm } from "../PrivatAvtaleFormProvider";

export function OppsummeringAvtaledetaljer() {
  const { form } = usePrivatAvtaleForm();
  const scopedForm = useFormScope(form.scope("steg3.avtaledetaljer"));
  const { t } = useOversettelse();

  const { nyAvtale, medInnkreving } = scopedForm.value();

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
            {nyAvtale === "true"
              ? t(teksterAvtaledetaljer.nyAvtale.true)
              : nyAvtale === "false"
                ? t(teksterAvtaledetaljer.nyAvtale.false)
                : t(tekster.ikkeUtfylt)}
          </FormSummaryValue>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            {t(teksterAvtaledetaljer.medInnkreving.label)}
          </FormSummaryLabel>
          <FormSummaryValue>
            {medInnkreving === "true"
              ? t(teksterAvtaledetaljer.medInnkreving.true)
              : medInnkreving === "false"
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
