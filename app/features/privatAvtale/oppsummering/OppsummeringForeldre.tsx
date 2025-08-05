import { BodyLong } from "@navikt/ds-react";
import { DescriptionList } from "~/components/ui/DescriptionList";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { usePrivatAvtaleForm } from "../PrivatAvtaleFormProvider";

export function OppsummeringForeldre() {
  const { form } = usePrivatAvtaleForm();
  const { t } = useOversettelse();
  const { deg, medforelder } = form.value();

  return (
    <section>
      <div className="mt-2 space-y-2">
        <BodyLong className="font-bold">{t(tekster.omDeg)}</BodyLong>

        <DescriptionList className="mb-4">
          <DescriptionList.Label>{t(tekster.fulltNavn)}</DescriptionList.Label>
          <DescriptionList.Value>
            {deg.fulltNavn || t(tekster.ikkeUtfylt)}
          </DescriptionList.Value>

          <DescriptionList.Label>{t(tekster.ident)}</DescriptionList.Label>
          <DescriptionList.Value>
            {deg.ident || t(tekster.ikkeUtfylt)}
          </DescriptionList.Value>
        </DescriptionList>

        <BodyLong className="font-bold">{t(tekster.omMedforelder)}</BodyLong>

        <DescriptionList>
          <DescriptionList.Label>{t(tekster.fulltNavn)}</DescriptionList.Label>
          <DescriptionList.Value>
            {medforelder.fulltNavn || t(tekster.ikkeUtfylt)}
          </DescriptionList.Value>

          <DescriptionList.Label>{t(tekster.ident)}</DescriptionList.Label>
          <DescriptionList.Value>
            {medforelder.ident || t(tekster.ikkeUtfylt)}
          </DescriptionList.Value>
        </DescriptionList>
      </div>
    </section>
  );
}

const tekster = definerTekster({
  omDeg: {
    nb: "Deg",
    nn: "Deg",
    en: "You",
  },
  omMedforelder: {
    nb: "Den andre forelderen",
    nn: "Den andre forelderen",
    en: "The other parent",
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
});
