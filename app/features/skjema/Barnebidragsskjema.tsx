import { Button, InfoCard } from "@navikt/ds-react";
import { type FormApi } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { Barnepass } from "./barnepass/Barnepass";
import BidragsrolleInfo from "./BidragsrolleInfo";
import { Bofohold } from "./Boforhold";
import { FellesBarnSkjema } from "./FellesBarnSkjema";
import { Inntektsopplysninger } from "./inntekt/Inntektsopplysninger";
import { type BarnebidragSkjema } from "./schema";
import { Ytelser } from "./Ytelser";

type Props = {
  form: FormApi<BarnebidragSkjema>;
};

export function Barnebidragsskjema({ form }: Props) {
  const { t } = useOversettelse();
  const bidragstype = form.value("bidragstype");
  const barn = form.value("barn");
  const gyldigeBarn = barn.filter((b) => b.alder !== "");
  const harGyldigeBarn = gyldigeBarn.length > 0;
  const harValgtBidragstype = bidragstype !== "";

  const skalViseBarnepass = harValgtBidragstype && harGyldigeBarn;
  const skalViseYtelser =
    harGyldigeBarn && (bidragstype === "MOTTAKER" || bidragstype === "PLIKTIG");

  const bostedVerdier = gyldigeBarn.map((b) => b.bosted);
  const harBarnHosMeg = bostedVerdier.includes("HOS_MEG");
  const harDeltFastBosted = bostedVerdier.includes("DELT_FAST_BOSTED");
  const harBarnHosMedforelder = bostedVerdier.includes("HOS_MEDFORELDER");
  const erBådeMottakerOgPliktig =
    (harBarnHosMeg && harBarnHosMedforelder) ||
    (harBarnHosMeg && harDeltFastBosted) ||
    (harBarnHosMedforelder && harDeltFastBosted);

  return (
    <form {...form.getFormProps()} className="flex flex-col gap-4">
      <FellesBarnSkjema />

      {erBådeMottakerOgPliktig && (
        <InfoCard data-color="brand-beige">
          <InfoCard.Header>
            <InfoCard.Title>{t(tekster.infoTittel)}</InfoCard.Title>
          </InfoCard.Header>
          <InfoCard.Content>{t(tekster.infoOmBeregning)}</InfoCard.Content>
        </InfoCard>
      )}

      {!erBådeMottakerOgPliktig && (
        <>
          <Inntektsopplysninger />
          <BidragsrolleInfo />

          {skalViseBarnepass && <Barnepass />}

          {skalViseYtelser && <Ytelser bidragstype={bidragstype} />}

          <Bofohold />

          <Button
            type="submit"
            className="self-start"
            loading={form.formState.isSubmitting}
          >
            {t(tekster.beregnBarnebidraget)}
          </Button>
        </>
      )}
    </form>
  );
}

const tekster = definerTekster({
  beregnBarnebidraget: {
    nb: "Beregn barnebidraget",
    en: "Calculate child support",
    nn: "Beregn barnebidraget",
  },
  infoTittel: {
    nb: "Har barna du vil avtale bidrag for, fast bosted hos hver sin forelder?",
    en: "Do the children you want to agree on support for have a fixed residence with each parent?",
    nn: "Har barna du vil avtale bidrag for, fast bustad hjå kvar sin forelder?",
  },
  infoOmBeregning: {
    nb: "Hvis barna du oppgir har fast bosted hos hver sin forelder må du kalkulere bidraget for barna hver for seg. Det betyr at du må bruke kalkulatoren to ganger - én gang per barn.",
    en: "If the children you specify have a fixed residence with each parent, you must calculate the support for the children separately. This means that you need to use the calculator twice - once per child.",
    nn: "Viss barna du oppgir har fast bustad hjå kvar sin forelder må du kalkulere bidraget for barna kvar for seg. Det betyr at du må bruke kalkulatoren to gonger - éin gong per barn.",
  },
});
