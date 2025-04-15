import { Button } from "@navikt/ds-react";
import { FormProvider, useForm } from "@rvf/react";
import { withZod } from "@rvf/zod";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { usePersoninformasjon } from "./usePersoninformasjon";
import { innloggetFormSchema } from "./schema";
import { getInnloggetFormDefaultValues } from "./utils";
import { Motpart } from "./Motpart";
import { BostedOgSamvær } from "./BostedOgSamvær";
import { Inntektsopplysninger } from "./Inntektsopplysninger";

const validator = withZod(innloggetFormSchema);

export function InnloggetBidragsskjema() {
  const personinformasjon = usePersoninformasjon();
  const form = useForm({
    validator,
    defaultValues: getInnloggetFormDefaultValues(personinformasjon),
  });

  const harValgtMotpart = Boolean(form.value("barn"));

  const { t } = useOversettelse();

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
