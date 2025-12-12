import { BodyLong, ReadMore } from "@navikt/ds-react";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export const SamværOgFerierInfo = () => {
  const { t } = useOversettelse();

  return (
    <ReadMore
      header={t(tekster.overskrift)}
      onOpenChange={(open) => {
        if (open) {
          sporHendelse({
            hendelsetype: "les mer utvidet",
            tekst: t(tekster.overskrift),
            id: "kalkulator-ferie-og-samvær",
          });
        }
      }}
    >
      <BodyLong className="mb-4">{t(tekster.beskrivelse1)}</BodyLong>
      <BodyLong>{t(tekster.beskrivelse2)}</BodyLong>
    </ReadMore>
  );
};

const tekster = definerTekster({
  overskrift: {
    nb: "Du kan legge til samvær i ferier og høytider selv",
    en: "You can add visitation during holidays and vacations yourself",
    nn: "Du kan sjølv legge til samvær i feriar og høgtider",
  },
  beskrivelse1: {
    nb: "Kalkulatoren kan foreløpig ikke legge til samvær i ferier og høytider separat. Derfor kan dere enten legge dette til selv i det månedlige samværet, eller bli enige om hvordan dere håndterer bidraget i månedene det er ekstra samvær.",
    en: "The calculator cannot yet add contact time for holidays and festive seasons separately. Therefore, you can either include this yourselves in the monthly contact time, or agree on how to handle the child support in the months with extra contact time.",
    nn: "Kalkulatoren kan førebels ikkje leggje til samvær i feriar og høgtider separat. Difor kan de anten leggje dette inn sjølve i det månadlege samværet, eller bli einige om korleis de vil handtere bidraget i månadene med ekstra samvær.",
  },
  beskrivelse2: {
    nb: "Eksempel: Lille Trille har 25 ekstra samværsdager med samværsforelderen per år i forbindelse med ferier og høytider. Da deler dere 25 dager på 12 måneder: 25/12 = 2,08333. Da kan dere legge til 2 dager i det månedlige samværet for samværsforelderen.",
    en: "Example: Little Trille has 25 extra days of visitation with the custodial parent per year with regards to vacations and holidays. Then you divide 25 days by 12 months: 25/12 = 2.08333. Then you can add 2 days to the monthly visitation for the custodial parent.",
    nn: "Eksempel: Lille Trille har 25 ekstra samværsdager med samværsforelderen per år i forbindelse med feriar og høgtider. Da deler de 25 dager på 12 måneder: 25/12 = 2,08333. Da kan de leggje til 2 dager i det månadlege samværet for samværsforelderen.",
  },
});
