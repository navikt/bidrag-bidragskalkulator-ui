import { BodyLong, Heading, List } from "@navikt/ds-react";
import { useField } from "@rvf/react";
import type { Person } from "~/features/privatAvtale/skjemaSchema";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export default function OppsummeringOgAvtale() {
  const { t } = useOversettelse();
  const deg = useField("deg").value() as Person;
  const medforelder = useField("medforelder").value() as Person;

  return (
    <>
      <BodyLong>{t(tekster.beskrivelse)}</BodyLong>
      <Heading level="3" size="medium">
        {t(tekster.omDeg)}
      </Heading>

      <List as="ul">
        <List.Item title={t(tekster.fulltNavn)}>{deg.fulltNavn}</List.Item>
        <List.Item title={t(tekster.ident)}>{deg.ident}</List.Item>
      </List>

      <Heading level="3" size="medium">
        {t(tekster.omDenAndreForelderem)}
      </Heading>

      <List as="ul">
        <List.Item title={t(tekster.fulltNavn)}>
          {medforelder.fulltNavn}
        </List.Item>
        <List.Item title={t(tekster.ident)}>{medforelder.ident}</List.Item>
      </List>

      <Heading level="3" size="medium">
        {t(tekster.barn)}
      </Heading>
    </>
  );
}

const tekster = definerTekster({
  beskrivelse: {
    nb: "Kontroller at alle opplysningene er korrekte. Dersom alle opplysningene er korrekte, kan du laste ned privat avtale.",
    nn: "Kontroller at alle opplysningane er korrekte. Dersom alle opplysningane er korrekte, kan du lasta ned privat avtale.",
    en: "Please verify that all information is correct. If all information is correct, you can download the private agreement.",
  },
  omDeg: {
    nb: "Om deg",
    nn: "Om deg",
    en: "About you",
  },
  fulltNavn: {
    nb: "Fullt navn",
    nn: "Fullt namn",
    en: "Full name",
  },
  ident: {
    nb: "Fødselsnummer eller D-nummer",
    en: "National ID or D-number",
    nn: "Fødselsnummer eller D-nummer",
  },
  omDenAndreForelderem: {
    nb: "Den andre forelderen",
    nn: "Den andre forelderen",
    en: "The other parent",
  },
  barn: {
    nb: "Barn",
    nn: "Barn",
    en: "Child",
  },
});
