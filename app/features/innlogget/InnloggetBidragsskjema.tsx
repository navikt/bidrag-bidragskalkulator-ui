import { Button } from "@navikt/ds-react";
import { FormProvider } from "@rvf/react";
import { useForm } from "@rvf/react-router";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { usePersoninformasjon } from "./usePersoninformasjon";
import {
  getInnloggetSkjema,
  type InnloggetSkjema,
  type InnloggetSkjemaValidert,
} from "./schema";
import { Motpart } from "./Motpart";
import { BostedOgSamvær } from "./BostedOgSamvær";
import { Inntektsopplysninger } from "./Inntektsopplysninger";
import { getInnloggetSkjemaStandardverdi } from "./utils";

export function InnloggetBidragsskjema() {
  const personinformasjon = usePersoninformasjon();
  const { språk } = useOversettelse();
  const { t } = useOversettelse();

  const form = useForm<InnloggetSkjema, InnloggetSkjemaValidert>({
    schema: getInnloggetSkjema(språk),
    submitSource: "state",
    method: "post",
    defaultValues: getInnloggetSkjemaStandardverdi(personinformasjon),
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
