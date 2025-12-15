import { Button, InfoCard } from "@navikt/ds-react";
import { type FormApi } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { Barnepass } from "./barnepass/Barnepass";
import { Bofohold } from "./Boforhold";
import { FellesBarnSkjema } from "./FellesBarnSkjema";
import { Inntektsopplysninger } from "./Inntektsopplysninger";
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
        <InfoCard data-color="info">
          <InfoCard.Header>
            <InfoCard.Title>{t(tekster.infoTittel)}</InfoCard.Title>
          </InfoCard.Header>
          <InfoCard.Content>{t(tekster.infoOmBeregning)}</InfoCard.Content>
        </InfoCard>
      )}

      {!erBådeMottakerOgPliktig && (
        <>
          <Inntektsopplysninger />

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
    nb: "Viktig informasjon",
    en: "Important information",
    nn: "Viktig informasjon",
  },
  infoOmBeregning: {
    nb: "Du kan bare beregne barnebidrag for barn du enten er bidragsmottaker eller bidragspliktig for - ikke begge deler samtidig. Hvis du har barn i begge kategorier, må du fylle ut et eget skjema for hver kategori.",
    en: "You can only calculate child support for children where you are either the recipient or the payer - not both at the same time. If you have children in both categories, you must fill out a separate form for each category.",
    nn: "Du kan berre berekne barnebidrag for barn du anten er bidragsmottakar eller bidragspliktig for - ikkje begge delar samtidig. Dersom du har barn i begge kategoriar, må du fylle ut eit eige skjema for kvar kategori.",
  },
});
