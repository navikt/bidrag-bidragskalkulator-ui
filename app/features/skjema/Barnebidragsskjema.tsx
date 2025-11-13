import { Button } from "@navikt/ds-react";
import { type FormApi } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { Bofohold } from "./Boforhold";
import { FellesBarnSkjema } from "./FellesBarnSkjema";
import { Inntektsopplysninger } from "./Inntektsopplysninger";
import { type BarnebidragSkjema } from "./schema";

type Props = {
  form: FormApi<BarnebidragSkjema>;
};

export function Barnebidragsskjema({ form }: Props) {
  const { t } = useOversettelse();

  return (
    <form {...form.getFormProps()} className="flex flex-col gap-4">
      <FellesBarnSkjema />
      <Inntektsopplysninger />
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
