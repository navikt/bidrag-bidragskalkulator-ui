import { DescriptionList } from "~/components/ui/DescriptionList";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { usePrivatAvtaleForm } from "../PrivatAvtaleFormProvider";

export function OppsummeringAvtaledetaljer() {
  const { form } = usePrivatAvtaleForm();
  const { t } = useOversettelse();
  const { nyAvtale, fraDato, medInnkreving } = form.value();

  return (
    <section>
      <DescriptionList>
        <DescriptionList.Label>{t(tekster.avtaleFra)}</DescriptionList.Label>
        <DescriptionList.Value>
          {fraDato || t(tekster.ikkeUtfylt)}
        </DescriptionList.Value>

        <DescriptionList.Label>{t(tekster.nyAvtale)}</DescriptionList.Label>
        <DescriptionList.Value>
          {nyAvtale === "true"
            ? t(tekster.ja)
            : nyAvtale === "false"
              ? t(tekster.nei)
              : t(tekster.ikkeUtfylt)}
        </DescriptionList.Value>

        <DescriptionList.Label>{t(tekster.oppgjørsform)}</DescriptionList.Label>
        <DescriptionList.Value>
          {medInnkreving === "true"
            ? t(tekster.innkrevingGjennomNav)
            : medInnkreving === "false"
              ? t(tekster.privatOppgjor)
              : t(tekster.ikkeUtfylt)}
        </DescriptionList.Value>
      </DescriptionList>
    </section>
  );
}

const tekster = definerTekster({
  avtaleFra: {
    nb: "Avtalen gjelder fra",
    nn: "Avtalen gjeld frå",
    en: "Agreement valid from",
  },
  nyAvtale: {
    nb: "Ny avtale",
    nn: "Ny avtale",
    en: "New agreement",
  },
  oppgjørsform: {
    nb: "Oppgjørsform",
    nn: "Oppgjerstype",
    en: "Payment arrangement",
  },
  innkrevingGjennomNav: {
    nb: "Gjennom Skatteetaten v/Nav Innkreving",
    nn: "Gjennom Skatteetaten v/Nav Innkreving",
    en: "Through the Tax Administration via NAV Collection",
  },
  privatOppgjor: {
    nb: "Privat oppgjør",
    nn: "Privat oppgjer",
    en: "Private settlement",
  },
  ja: {
    nb: "Ja",
    nn: "Ja",
    en: "Yes",
  },
  nei: {
    nb: "Nei",
    nn: "Nei",
    en: "No",
  },
  ikkeUtfylt: {
    nb: "Ikke utfylt",
    nn: "Ikkje utfylt",
    en: "Not filled in",
  },
});
