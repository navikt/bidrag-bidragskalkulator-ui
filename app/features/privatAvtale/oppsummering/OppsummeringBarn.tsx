import { BodyLong } from "@navikt/ds-react";
import { DescriptionList } from "~/components/ui/DescriptionList";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { usePrivatAvtaleForm } from "../PrivatAvtaleFormProvider";

export function OppsummeringBarn() {
  const { form } = usePrivatAvtaleForm();
  const { t } = useOversettelse();
  const { barn } = form.value();

  return (
    <section>
      <div className="mt-2 space-y-4">
        {barn.map((barn, i) => (
          <div key={i}>
            <BodyLong className="mb-4">
              {t(tekster.barnLabel)} {i + 1}
            </BodyLong>

            <DescriptionList>
              <DescriptionList.Label>
                {t(tekster.fulltNavn)}
              </DescriptionList.Label>
              <DescriptionList.Value>
                {barn.fulltNavn || t(tekster.ikkeUtfylt)}
              </DescriptionList.Value>

              <DescriptionList.Label>{t(tekster.ident)}</DescriptionList.Label>
              <DescriptionList.Value>
                {barn.ident || t(tekster.ikkeUtfylt)}
              </DescriptionList.Value>

              <DescriptionList.Label>
                {t(tekster.bidragstype)}
              </DescriptionList.Label>
              <DescriptionList.Value>
                {barn.bidragstype || t(tekster.ikkeUtfylt)}
              </DescriptionList.Value>

              <DescriptionList.Label>
                {t(tekster.belopPerManed)}
              </DescriptionList.Label>
              <DescriptionList.Value>
                {barn.sum || t(tekster.ikkeUtfylt)}
              </DescriptionList.Value>
            </DescriptionList>
          </div>
        ))}
      </div>
    </section>
  );
}

const tekster = definerTekster({
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
