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
    nb: "Fast bosted betyr der barnet har folkeregistrert adresse. Barn kan bare være folkeregistrert på ett sted. Den som barnet er folkeregistret hos, har rett til å alene bestemme over flytting innenlands, barnehage, SFO/AKS og fritidsaktiviteter for barnet.",
    en: "Permanent residence means where the child is registered in the National Registry. A child can only be registered in one place. The person with whom the child is registered has the right to make decisions alone regarding domestic relocation, kindergarten, after-school programs, and leisure activities for the child.",
    nn: "Fast bustad betyr der barnet har folkeregistrert adresse. Barn kan berre vere folkeregistrert på ein stad. Den som barnet er folkeregistret hos, har rett til å aleine bestemme over flytting innanlands, barnehage, SFO/AKS og fritidsaktivitetar for barnet.",
  },
  beskrivelse2: {
    nb: "Delt fast bosted betyr at dere har laget en juridisk bindende avtale om at begge skal bestemme dette, selv om barnet bare er folkeregistrert hos én av dere.",
    en: "Shared permanent residence means that you have made a legally binding agreement that both of you will make these decisions, even though the child is only registered with one of you.",
    nn: "Delt fast bustad betyr at de har laga ein juridisk bindande avtale om at begge skal bestemme dette, sjølv om barnet berre er folkeregistrert hos éin av dykk.",
  },
});
