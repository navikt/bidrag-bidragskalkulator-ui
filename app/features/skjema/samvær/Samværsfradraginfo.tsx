import { BodyLong, List } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { ReadMore } from "@navikt/ds-react/ReadMore";
import { useKalkulatorgrunnlagsdata } from "~/routes/kalkulator";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export const Samværsfradraginfo = () => {
  const {
    kalkulatorGrunnlagsdata: { samværsfradrag },
    miljø,
  } = useKalkulatorgrunnlagsdata();
  const { t } = useOversettelse();

  // TODO: vi skjuler den nye til alt funksjonaliter er på plass
  if (!["local", "dev"].includes(miljø) || !samværsfradrag) {
    return null;
  }

  return (
    <ReadMore
      header={t(tekster.overskrift)}
      onOpenChange={(open) => {
        if (open) {
          sporHendelse({
            hendelsetype: "les mer utvidet",
            tekst: t(tekster.overskrift),
            id: "kalkulator-bosted-og-samvær",
          });
        }
      }}
    >
      <BodyLong className="mb-4">{t(tekster.beskrivelse)}</BodyLong>

      <List>
        <ListItem>{t(tekster.beskrivelseKalkulator)}</ListItem>
        <ListItem>{t(tekster.beskrivelseFradraget)}</ListItem>
      </List>
    </ReadMore>
  );
};

const tekster = definerTekster({
  overskrift: {
    nb: "Hvorfor spør vi om fast bosted og samvær?",
    en: "Why we ask about residence and visitation",
    nn: "Kvifor vi spør om bustad og samvær",
  },
  beskrivelse: {
    nb: "Vi spør om fast bosted og samvær fordi det påvirker hvordan kalkulatoren beregner barnebidraget.",
    en: "We ask about permanent residence and visitation because it affects how the calculator determines the child support amount.",
    nn: "Vi spør om fast bustad og samvær fordi det påverkar korleis kalkulatoren reknar ut barnebidraget.",
  },
  beskrivelseKalkulator: {
    nb: "Hvis barnet har delt fast bosted går kalkulatoren ut fra at dere deler likt på samvær og kostnader.",
    en: "If the child has shared residence, the calculator assumes that both parents share contact time and expenses equally.",
    nn: "Viss barnet har delt fast bustad, går kalkulatoren ut frå at de deler likt på samvær og kostnader.",
  },
  beskrivelseFradraget: {
    nb: "Hvis barnet bor fast hos én forelder og har samvær med den andre, kan samværsforelderen få fradrag i barnebidraget. Fradraget kommer an på alder på barnet, og hvor mye samvær barnet har med den som skal betale bidraget.",
    en: "If the child lives permanently with one parent and has visitation with the other, the parent with visitation may receive a deduction in the child support payment. The deduction depends on the child’s age and how much time the child spends with the parent who is required to pay support.",
    nn: "Viss barnet bur fast hos éin forelder og har samvær med den andre, kan samværsforelderen få frådrag i barnebidraget. Frådraget kjem an på kor gammalt barnet er, og kor mykje samvær barnet har med den som skal betale bidraget.",
  },
});
