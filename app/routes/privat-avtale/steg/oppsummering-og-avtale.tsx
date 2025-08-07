import { Alert, Button } from "@navikt/ds-react";
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
import type { PrivatAvtaleFlerstegsSkjema } from "~/features/privatAvtale/skjemaSchema";
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

function finnUfullstendigeSteg(
  data: PrivatAvtaleFlerstegsSkjema,
  feil: Record<string, unknown>,
  privatAvtaleSteg: StegdataType[],
): StegdataType[] {
  const erTom = (tekst?: string) => !tekst || tekst.trim() === "";
  const harFeil = (nøkkel: string) =>
    Object.keys(feil).some((key) => key.startsWith(nøkkel));

  const ufullstendig: StegdataType[] = [];

  const manglerForeldre =
    erTom(data.steg1.deg.fulltNavn) ||
    erTom(data.steg1.deg.ident) ||
    erTom(data.steg1.medforelder.fulltNavn) ||
    erTom(data.steg1.medforelder.ident) ||
    harFeil("steg1.deg") ||
    harFeil("steg1.medforelder");

  if (manglerForeldre) {
    const steg = privatAvtaleSteg.find((s) => s.step === 1);
    if (steg) {
      ufullstendig.push(steg);
    }
  }

  const manglerBarn =
    data.steg2.barn.length === 0 ||
    data.steg2.barn.some(
      (barn) =>
        erTom(barn.fulltNavn) ||
        erTom(barn.ident) ||
        erTom(barn.sum) ||
        erTom(barn.bidragstype),
    ) ||
    harFeil("steg2.barn");

  if (manglerBarn) {
    const steg = privatAvtaleSteg.find((steg) => steg.step === 2);
    if (steg) {
      ufullstendig.push(steg);
    }
  }

  const manglerAvtale =
    erTom(data.steg3.avtaledetaljer.fraDato) ||
    data.steg3.avtaledetaljer.nyAvtale === "" ||
    data.steg3.avtaledetaljer.medInnkreving === "" ||
    harFeil("steg3.avtaledetaljer.fraDato") ||
    harFeil("steg3.avtaledetaljer.nyAvtale") ||
    harFeil("steg3.avtaledetaljer.medInnkreving");

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
