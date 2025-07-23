import { Heading, List } from "@navikt/ds-react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { usePrivatAvtaleForm } from "../PrivatAvtaleFormProvider";

export function OppsummeringAvtaledetaljer() {
  const { form } = usePrivatAvtaleForm();
  const { t } = useOversettelse();
  const { nyAvtale, fraDato, medInnkreving } = form.value();

  return (
    <section>
      <Heading size="small" level="3">
        {t(tekster.avtaledetaljerTittel)}
      </Heading>
      <List as="ul">
        <List.Item title={t(tekster.avtaleFra)}>
          {fraDato || t(tekster.ikkeUtfylt)}
        </List.Item>
        <List.Item title={t(tekster.nyAvtale)}>
          {nyAvtale === "true"
            ? t(tekster.ja)
            : nyAvtale === "false"
              ? t(tekster.nei)
              : t(tekster.ikkeUtfylt)}
        </List.Item>
        <List.Item title={t(tekster.oppgjørsform)}>
          {medInnkreving === "true"
            ? t(tekster.innkrevingGjennomNav)
            : medInnkreving === "false"
              ? t(tekster.privatOppgjor)
              : t(tekster.ikkeUtfylt)}
        </List.Item>
      </List>
    </section>
  );
}

const tekster = definerTekster({
  avtaledetaljerTittel: {
    nb: "Avtaledetaljer",
    nn: "Avtaledetaljar",
    en: "Agreement details",
  },
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
