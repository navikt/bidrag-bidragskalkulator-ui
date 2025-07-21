import { Button, VStack } from "@navikt/ds-react";
import { OppsummeringAvtaledetaljer } from "~/features/privatAvtale/oppsummering/OppsummeringAvtaledetaljer";
import { OppsummeringBarn } from "~/features/privatAvtale/oppsummering/OppsummeringBarn";
import { OppsummeringForeldre } from "~/features/privatAvtale/oppsummering/OppsummeringForeldre";
import OppsummeringsVarsel from "~/features/privatAvtale/oppsummering/OppsummeringsVarsel";
import { usePrivatAvtaleForm } from "~/features/privatAvtale/PrivatAvtaleFormProvider";
import {
  stegdata,
  type StegdataType,
} from "~/features/privatAvtale/privatAvtaleSteg";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export default function OppsummeringOgAvtale() {
  const form = usePrivatAvtaleForm();
  const { t, språk } = useOversettelse();
  const { deg, medforelder, barn, fraDato, nyAvtale, medInnkreving } =
    form.value();

  const privatAvtaleSteg = stegdata(språk);

  const manglendeSteg = finnFørsteUfullstendigeSteg();
  const harMangler = manglendeSteg !== undefined;

  function erTom(tekst: string | undefined) {
    return !tekst || tekst.trim() === "";
  }

  function finnFørsteUfullstendigeSteg(): StegdataType | undefined {
    if (
      erTom(deg.fulltNavn) ||
      erTom(deg.ident) ||
      erTom(medforelder.fulltNavn) ||
      erTom(medforelder.ident)
    ) {
      return privatAvtaleSteg.find((steg) => steg.step === 1);
    }
    if (
      barn.length === 0 ||
      barn.some(
        (barn) =>
          erTom(barn.fulltNavn) ||
          erTom(barn.ident) ||
          erTom(barn.sum) ||
          erTom(barn.bidragstype),
      )
    ) {
      return privatAvtaleSteg.find((steg) => steg.step === 2);
    }
    if (erTom(fraDato) || nyAvtale === "" || medInnkreving === "") {
      return privatAvtaleSteg.find((steg) => steg.step === 3);
    }

    return undefined;
  }

  return (
    <VStack gap="6">
      {harMangler && <OppsummeringsVarsel manglendeSteg={manglendeSteg} />}
      <OppsummeringForeldre />
      <OppsummeringBarn />
      <OppsummeringAvtaledetaljer />

      <Button
        variant="primary"
        onClick={() => form.submit()}
        disabled={harMangler}
      >
        {t(tekster.lastNedKnapp)}
      </Button>
    </VStack>
  );
}

const tekster = definerTekster({
  lastNedKnapp: {
    nb: "Last ned privat avtale",
    nn: "Last ned privat avtale",
    en: "Download private agreement",
  },
});
