import { Heading, Label, List } from "@navikt/ds-react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { usePrivatAvtaleForm } from "../PrivatAvtaleFormProvider";

export function OppsummeringBarn() {
  const form = usePrivatAvtaleForm();
  const { t } = useOversettelse();
  const { barn } = form.value();

  return (
    <section>
      <Heading size="small" level="3">
        {t(tekster.barnTittel)}
      </Heading>

      <div className="mt-2 space-y-4">
        {barn.map((b, i) => (
          <div key={i} className="space-y-1">
            <Label>
              {t(tekster.barnLabel)} {i + 1}
            </Label>
            <List as="ul" className="list-none pl-0">
              <List.Item title={t(tekster.fulltNavn)}>
                {b.fulltNavn || t(tekster.ikkeUtfylt)}
              </List.Item>
              <List.Item title={t(tekster.ident)}>
                {b.ident || t(tekster.ikkeUtfylt)}
              </List.Item>
              <List.Item title={t(tekster.bidragstype)}>
                {b.bidragstype || t(tekster.ikkeUtfylt)}
              </List.Item>
              <List.Item title={t(tekster.belopPerManed)}>
                {b.sum || t(tekster.ikkeUtfylt)}
              </List.Item>
            </List>
          </div>
        ))}
      </div>
    </section>
  );
}

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
    nb: "Bidragstype",
    nn: "Bidragstype",
    en: "Contribution type",
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
});
