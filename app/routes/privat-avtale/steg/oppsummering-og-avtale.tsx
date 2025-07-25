import { Alert, Button, VStack } from "@navikt/ds-react";
import { useEffect } from "react";
import { OppsummeringAvtaledetaljer } from "~/features/privatAvtale/oppsummering/OppsummeringAvtaledetaljer";
import { OppsummeringBarn } from "~/features/privatAvtale/oppsummering/OppsummeringBarn";
import { OppsummeringForeldre } from "~/features/privatAvtale/oppsummering/OppsummeringForeldre";
import OppsummeringsVarsel from "~/features/privatAvtale/oppsummering/OppsummeringsVarsel";
import { usePrivatAvtaleForm } from "~/features/privatAvtale/PrivatAvtaleFormProvider";
import {
  stegdata,
  type StegdataType,
} from "~/features/privatAvtale/privatAvtaleSteg";
import type { PrivatAvtaleSkjema } from "~/features/privatAvtale/skjemaSchema";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export default function OppsummeringOgAvtale() {
  const { form, feilVedHentingAvAvtale, antallNedlastedeFiler } =
    usePrivatAvtaleForm();
  const { t, språk } = useOversettelse();

  const { isSubmitting, submitStatus, fieldErrors } = form.formState;
  const innsendingsfeil = submitStatus === "error" && feilVedHentingAvAvtale;
  const innsendingVellykket =
    submitStatus === "success" && antallNedlastedeFiler;

  const steg = stegdata(språk);

  const ufullstendigeSteg = finnUfullstendigeSteg(
    form.value(),
    fieldErrors,
    steg,
  );
  const harUfullstendigeSteg = ufullstendigeSteg.length > 0;

  useEffect(() => {
    if (innsendingsfeil || innsendingVellykket) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [innsendingsfeil, innsendingVellykket]);

  return (
    <VStack gap="6">
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
      <OppsummeringForeldre />
      <OppsummeringBarn />
      <OppsummeringAvtaledetaljer />

      <Button
        variant="primary"
        className="w-full sm:w-60"
        type="submit"
        disabled={harUfullstendigeSteg}
        loading={isSubmitting}
      >
        {isSubmitting ? t(tekster.lasterNed) : t(tekster.lastNedKnapp)}
      </Button>
    </VStack>
  );
}

function finnUfullstendigeSteg(
  data: PrivatAvtaleSkjema,
  feil: Record<string, unknown>,
  privatAvtaleSteg: StegdataType[],
): StegdataType[] {
  const erTom = (tekst?: string) => !tekst || tekst.trim() === "";
  const harFeil = (nøkkel: string) =>
    Object.keys(feil).some((key) => key.startsWith(nøkkel));

  const ufullstendig: StegdataType[] = [];

  const manglerForeldre =
    erTom(data.deg.fulltNavn) ||
    erTom(data.deg.ident) ||
    erTom(data.medforelder.fulltNavn) ||
    erTom(data.medforelder.ident) ||
    harFeil("deg") ||
    harFeil("medforelder");

  if (manglerForeldre) {
    const steg = privatAvtaleSteg.find((s) => s.step === 1);
    if (steg) {
      ufullstendig.push(steg);
    }
  }

  const manglerBarn =
    data.barn.length === 0 ||
    data.barn.some(
      (barn) =>
        erTom(barn.fulltNavn) ||
        erTom(barn.ident) ||
        erTom(barn.sum) ||
        erTom(barn.bidragstype),
    ) ||
    harFeil("barn");

  if (manglerBarn) {
    const steg = privatAvtaleSteg.find((steg) => steg.step === 2);
    if (steg) {
      ufullstendig.push(steg);
    }
  }

  const manglerAvtale =
    erTom(data.fraDato) ||
    data.nyAvtale === "" ||
    data.medInnkreving === "" ||
    harFeil("fraDato") ||
    harFeil("nyAvtale") ||
    harFeil("medInnkreving");

  if (manglerAvtale) {
    const steg = privatAvtaleSteg.find((steg) => steg.step === 3);
    if (steg) {
      ufullstendig.push(steg);
    }
  }

  return ufullstendig;
}

const tekster = definerTekster({
  lastNedKnapp: {
    nb: "Last ned privat avtale",
    nn: "Last ned privat avtale",
    en: "Download private agreement",
  },
  lasterNed: {
    nb: "Laster ned ...",
    nn: "Lastar ned ...",
    en: "Dowloading ...",
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
