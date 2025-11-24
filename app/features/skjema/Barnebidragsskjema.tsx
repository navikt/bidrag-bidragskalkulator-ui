import { Button } from "@navikt/ds-react";
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
  const dinInntekt = form.value("deg.inntekt");
  const medforelderInntekt = form.value("medforelder.inntekt");

  return (
    <form {...form.getFormProps()} className="flex flex-col gap-4">
      <FellesBarnSkjema />
      <Inntektsopplysninger />
      {dinInntekt && medforelderInntekt && <Barnepass />}
      {bidragstype === "BEGGE" ? (
        <>
          <Ytelser bidragstype="MOTTAKER" />
          <Ytelser bidragstype="PLIKTIG" />
        </>
      ) : (
        (bidragstype === "MOTTAKER" || bidragstype === "PLIKTIG") && (
          <Ytelser bidragstype={bidragstype} />
        )
      )}
      <Bofohold />

      <Button
        type="submit"
        className="self-start"
        loading={form.formState.isSubmitting}
      >
        {t(tekster.beregnBarnebidraget)}
      </Button>
    </form>
  );
}

const tekster = definerTekster({
  beregnBarnebidraget: {
    nb: "Beregn barnebidraget",
    en: "Calculate child support",
    nn: "Beregn barnebidraget",
  },
});
