import { BodyLong, ReadMore } from "@navikt/ds-react";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export const FastBostedInfo = () => {
  const { t } = useOversettelse();

  return (
    <ReadMore
      header={t(tekster.overskrift)}
      onOpenChange={(open) => {
        if (open) {
          sporHendelse({
            hendelsetype: "les mer utvidet",
            tekst: t(tekster.overskrift),
            id: "kalkulator-fast-bosted",
          });
        }
      }}
    >
      <BodyLong spacing>{t(tekster.beskrivelse1)}</BodyLong>
      <BodyLong>{t(tekster.beskrivelse2)}</BodyLong>
    </ReadMore>
  );
};

const tekster = definerTekster({
  overskrift: {
    nb: "Hva er fast bosted og delt fast bosted",
    en: "What is permanent residence and shared permanent residence",
    nn: "Kva er fast bustad og delt fast bustad",
  },
  beskrivelse1: {
    nb: "Delt fast bosted betyr at dere har laget en juridisk bindende avtale etter barnelovens §36, om at begge skal bestemme over flytting innenlands, barnehage, SFO/AKS og fritidsaktiviteter for barnet. Har dere delt fast bosted regner kalkulatoren at dere har like store kostnader for barnet.",
    en: "Shared permanent residence means that you have made a legally binding agreement according to § 36 of the Children's Act, stating that both of you will decide on domestic relocation, kindergarten, SFO/AKS and leisure activities for the child. If you have shared permanent residence, the calculator calculates that you split the costs equally for the child.",
    // TODO: nynorsk er ikke oppdatert
    nn: "Fast bustad betyr der barnet har folkeregistrert adresse. Barn kan berre vere folkeregistrert på éin stad. Den som barnet er folkeregistret hos, har rett til å aleine bestemme over flytting innanlands, barnehage, SFO/AKS og fritidsaktivitetar for barnet.",
  },
  beskrivelse2: {
    nb: "Fast bosted er der barnet har folkeregistrert adresse, og der barnet bor mest. Når barnet bor mest hos den ene forelderen kaller man tiden barnet er med den andre forelderen for samvær. Velg om barnet bor hos deg eller den andre, og så fyll inn antall netter barnet er hos deg i løpet av en måned.",
    en: "Permanent residence is where the child is registered in the National Registry, and is the place where the child lives most of the time. When the child lives most of the time with one parent, the time the child spends with the other parent is called visitation. Choose whether the child lives with you or the other, and then fill in the number of nights the child is with you during a month.",
    // TODO: nynorsk er ikke oppdatert
    nn: "Delt fast bustad betyr at de har laga ein juridisk bindande avtale om at begge skal bestemme dette, sjølv om barnet berre er folkeregistrert hos éin av dykk.",
  },
});
