import { Button } from "@navikt/ds-react";
import { FormProvider, type FormApi } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { Avtaledetaljer } from "./Avtaledetaljer";
import { Avtalepart } from "./Avtalepart";
import { PrivatAvtaleBarn } from "./PrivatAvtaleBarn";
import type { PrivatAvtaleSkjema } from "./skjemaSchema";

type Props = {
  form: FormApi<PrivatAvtaleSkjema>;
};

export function PrivatAvtaleSkjema({ form }: Props) {
  const { t } = useOversettelse();

  return (
    <FormProvider scope={form.scope()}>
      <form {...form.getFormProps()} className="flex flex-col gap-4">
        <Avtalepart part="deg" />
        <Avtalepart part="medforelder" />

        <PrivatAvtaleBarn />

        <Avtaledetaljer />

        <Button
          type="submit"
          className="self-start"
          loading={form.formState.isSubmitting}
        >
          {t(tekster.genererDokument)}
        </Button>
      </form>
    </FormProvider>
  );
}

const tekster = definerTekster({
  genererDokument: {
    nb: "Generer avtaledokument",
    en: "Generate agreement document",
    nn: "Generer avtaledokument",
  },
});
