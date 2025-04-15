import { Button } from "@navikt/ds-react";
import { FormProvider, useForm } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { usePersoninformasjon } from "./usePersoninformasjon";
import { getInnloggetBidragsskjemaValidator } from "./schema";
import { getInnloggetFormDefaultValues } from "./utils";
import { Motpart } from "./Motpart";
import { BostedOgSamvær } from "./BostedOgSamvær";
import { Inntektsopplysninger } from "./Inntektsopplysninger";

export function InnloggetBidragsskjema() {
  const personinformasjon = usePersoninformasjon();
  const { språk } = useOversettelse();
  const validator = getInnloggetBidragsskjemaValidator(språk);
  const { t } = useOversettelse();

  const form = useForm({
    validator: validator,
    defaultValues: getInnloggetFormDefaultValues(personinformasjon),
  });

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
