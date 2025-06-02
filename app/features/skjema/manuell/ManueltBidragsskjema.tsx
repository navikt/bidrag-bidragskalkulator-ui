import { Button } from "@navikt/ds-react";
import { FormProvider, type FormApi } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { Husstandsmedlemmer } from "../Husstandsmedlemmer";
import { Inntektsopplysninger } from "../Inntektsopplysninger";
import { type ManueltSkjema } from "../schema";
import { ManuellBarnSkjema } from "./ManuellBarnSkjema";

type Props = {
  form: FormApi<ManueltSkjema>;
};

export function ManueltBidragsskjema({ form }: Props) {
  const { t } = useOversettelse();

  return (
    <FormProvider scope={form.scope()}>
      <form {...form.getFormProps()} className="flex flex-col gap-4">
        <ManuellBarnSkjema />
        <Husstandsmedlemmer part="deg" />
        <Husstandsmedlemmer part="medforelder" />
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
