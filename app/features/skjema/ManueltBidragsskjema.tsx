import { Button } from "@navikt/ds-react";
import { FormProvider, type FormApi } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { BostedOgSamvær } from "./BostedOgSamvær";
import { Inntektsopplysninger } from "./Inntektsopplysninger";
import { Motpart } from "./Motpart";
import { type ManueltSkjema } from "./schema";

type Props = {
  form: FormApi<ManueltSkjema>;
};

export function ManueltBidragsskjema({ form }: Props) {
  const { t } = useOversettelse();

  const harValgtMotpart = form.value("barn").length > 0;

  return (
    <FormProvider scope={form.scope()}>
      <form {...form.getFormProps()} className="flex flex-col gap-4">
        <Motpart />
        {harValgtMotpart && (
          <>
            <BostedOgSamvær />
            <Inntektsopplysninger />
          </>
        )}

        <Button
          type="submit"
          className="self-start"
          loading={form.formState.isSubmitting}
        >
          {t(tekster.beregnBarnebidraget)}
        </Button>
      </form>
    </FormProvider>
  );
}

const tekster = definerTekster({
  beregnBarnebidraget: {
    nb: "Beregn barnebidraget",
    en: "Calculate child support",
    nn: "Beregn fostringstilskotet",
  },
});
