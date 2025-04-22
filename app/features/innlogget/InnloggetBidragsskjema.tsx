import { Button } from "@navikt/ds-react";
import { FormProvider, type FormApi } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { type InnloggetSkjema } from "./schema";
import { Motpart } from "./Motpart";
import { BostedOgSamvær } from "./BostedOgSamvær";
import { Inntektsopplysninger } from "./Inntektsopplysninger";

type Props = {
  form: FormApi<InnloggetSkjema>;
};

export function InnloggetBidragsskjema({ form }: Props) {
  const { t } = useOversettelse();

  const harValgtMotpart = Boolean(form.value("barn"));

  return (
    <FormProvider scope={form.scope()}>
      <form {...form.getFormProps()} className="flex flex-col gap-4">
        <Motpart />
        {harValgtMotpart && <BostedOgSamvær />}
        <Inntektsopplysninger />

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
