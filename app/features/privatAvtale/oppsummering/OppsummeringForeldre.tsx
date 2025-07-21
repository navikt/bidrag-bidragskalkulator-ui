import { Heading, Label, List } from "@navikt/ds-react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { usePrivatAvtaleForm } from "../PrivatAvtaleFormProvider";

export function OppsummeringForeldre() {
  const form = usePrivatAvtaleForm();
  const { t } = useOversettelse();
  const { deg, medforelder } = form.value();

  return (
    <section>
      <Heading size="small" level="3">
        {t(tekster.foreldreTittel)}
      </Heading>
      <div className="mt-2 space-y-2">
        <Label>{t(tekster.omDeg)}</Label>
        <List as="ul" className="list-none pl-0">
          <List.Item title={t(tekster.fulltNavn)}>
            {deg.fulltNavn || t(tekster.ikkeUtfylt)}
          </List.Item>
          <List.Item title={t(tekster.ident)}>
            {deg.ident || t(tekster.ikkeUtfylt)}
          </List.Item>
        </List>

        <Label>{t(tekster.omMedforelder)}</Label>
        <List as="ul" className="list-none pl-0">
          <List.Item title={t(tekster.fulltNavn)}>
            {medforelder.fulltNavn || t(tekster.ikkeUtfylt)}
          </List.Item>
          <List.Item title={t(tekster.ident)}>
            {medforelder.ident || t(tekster.ikkeUtfylt)}
          </List.Item>
        </List>
      </div>
    </section>
  );
}

const tekster = definerTekster({
  foreldreTittel: {
    nb: "Om deg og den andre forelderen",
    nn: "Om deg og den andre forelderen",
    en: "About you and the other parent",
  },
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
