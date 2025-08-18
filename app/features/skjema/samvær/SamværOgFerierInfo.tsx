import { BodyLong, ReadMore } from "@navikt/ds-react";
import { sporHendelseEnGang } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export const SamværOgFerierInfo = () => {
  const { t } = useOversettelse();

  return (
    <ReadMore
      header={t(tekster.overskrift)}
      onOpenChange={() =>
        sporHendelseEnGang({
          hendelsetype: "infoboks om ferie og samvær utvidet",
          skjemaId: "barnebidragskalkulator-under-18",
        })
      }
    >
      <BodyLong className="mb-4">{t(tekster.beskrivelse1)}</BodyLong>
      <BodyLong className="mb-4">{t(tekster.beskrivelse2)}</BodyLong>
      <BodyLong>{t(tekster.beskrivelse3)}</BodyLong>
    </ReadMore>
  );
};

const tekster = definerTekster({
  overskrift: {
    nb: "Hvordan ferie påvirker barnebidraget",
    en: "How holidays affect child support",
    nn: "Korleis ferie påverkar barnebidraget",
  },
  beskrivelse1: {
    nb: "Hvis dere fordeler feriene på samme måte som dere fordeler samværet ellers i året, vil det vanligvis ikke påvirke barnebidraget.",
    en: "If you distribute the holidays in the same way as you distribute the visitation throughout the year, it will usually not affect child support.",
    nn: "Dersom de fordeler feriane på same måte som dei fordeler samværet elles i året, vil det vanlegvis ikkje påverke barnebidraget.",
  },
  beskrivelse2: {
    nb: "Hvis det er stor forskjell mellom hvordan dere fordeler feriene, og hvordan dere fordeler samværet ellers i året, bør dere regne feriedagene med i det totale antallet samværsdager per måned.",
    en: "If there is a big difference between how you distribute the holidays and how you distribute the visitation throughout the year, you should include the holiday days in the total number of visitation days per month.",
    nn: "Dersom det er stor forskjell mellom korleis de fordeler feriane, og korleis de fordeler samværet elles i året, bør de rekne feriedagane med i det totale antallet samværsdagar per månad.",
  },
  beskrivelse3: {
    nb: "Eksempel: 12 dager samvær i ferien er i gjennomsnitt én ekstra samværsdag per måned.",
    en: "Example: 12 days of visitation during the holidays is on average one extra visitation day per month.",
    nn: "Døme: 12 dagar samvær i ferien er i gjennomsnitt éin ekstra samværsdag per månad.",
  },
});
