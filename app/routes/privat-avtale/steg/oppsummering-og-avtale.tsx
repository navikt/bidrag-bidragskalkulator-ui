import { Alert, Button } from "@navikt/ds-react";
import { useEffect } from "react";
import { OppsummeringAndreBestemmelser } from "~/features/privatAvtale/oppsummering/OppsummeringAndreBestemmelser";
import { OppsummeringAvtaledetaljer } from "~/features/privatAvtale/oppsummering/OppsummeringAvtaledetaljer";
import { OppsummeringBarn } from "~/features/privatAvtale/oppsummering/OppsummeringBarn";
import { OppsummeringForeldre } from "~/features/privatAvtale/oppsummering/OppsummeringForeldre";
import OppsummeringsVarsel from "~/features/privatAvtale/oppsummering/OppsummeringsVarsel";
import { OppsummeringVedlegg } from "~/features/privatAvtale/oppsummering/OppsummeringVedlegg";
import { useUfullstendigeSteg } from "~/features/privatAvtale/oppsummering/useUfullstendigeSteg";
import { usePrivatAvtaleForm } from "~/features/privatAvtale/PrivatAvtaleFormProvider";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export default function OppsummeringOgAvtale() {
  const { form, feilVedHentingAvAvtale, antallNedlastedeFiler } =
    usePrivatAvtaleForm();
  const { t } = useOversettelse();

  const { isSubmitting, submitStatus } = form.formState;
  const innsendingsfeil = submitStatus === "error" && feilVedHentingAvAvtale;
  const innsendingVellykket =
    submitStatus === "success" && antallNedlastedeFiler;

  const ufullstendigeSteg = useUfullstendigeSteg();
  const harUfullstendigeSteg = ufullstendigeSteg.length > 0;

  useEffect(() => {
    if (innsendingsfeil || innsendingVellykket) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [innsendingsfeil, innsendingVellykket]);

  return (
    <div className="flex flex-col gap-6">
      {harUfullstendigeSteg && (
        <OppsummeringsVarsel ufullstendigSteg={ufullstendigeSteg} />
      )}
      {innsendingsfeil && (
        <Alert variant="error">{feilVedHentingAvAvtale}</Alert>
      )}
      {innsendingVellykket && (
        <Alert variant="success">
          {t(tekster.suksessmelding(antallNedlastedeFiler))}
        </Alert>
      )}
      <div className="flex flex-col gap-4">
        <OppsummeringForeldre />
        <OppsummeringBarn />
        <OppsummeringAvtaledetaljer />
        <OppsummeringAndreBestemmelser />
        <OppsummeringVedlegg />
      </div>

      <Button
        variant="primary"
        className="w-full sm:w-60"
        type="submit"
        disabled={harUfullstendigeSteg}
        loading={isSubmitting}
      >
        {isSubmitting ? t(tekster.lasterNed) : t(tekster.lastNedKnapp)}
      </Button>
    </div>
  );
}

const tekster = definerTekster({
  lastNedKnapp: {
    nb: "Last ned privat avtale",
    nn: "Last ned privat avtale",
    en: "Download private agreement",
  },
  lasterNed: {
    nb: "Laster ned…",
    nn: "Lastar ned…",
    en: "Downloading…",
  },
  suksessmelding: (antallFiler) => ({
    nb:
      antallFiler === 1
        ? "Avtalen ble generert og lastet ned."
        : `${antallFiler} avtaler ble generert og lastet ned.`,
    nn:
      antallFiler === 1
        ? "Avtalen blei generert og lasta ned."
        : `${antallFiler} avtalar blei generert og lasta ned.`,
    en:
      antallFiler === 1
        ? "The agreement was generated and downloaded."
        : `${antallFiler} agreements were generated and downloaded.`,
  }),
});
