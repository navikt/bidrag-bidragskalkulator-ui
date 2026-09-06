import { PersonCrossIcon } from "@navikt/aksel-icons";
import { Box, Button } from "@navikt/ds-react";
import { useFormContext, useFormScope } from "@rvf/react";
import { Årstallvelger } from "~/components/ui/Årstallvelger";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { Samvær } from "./samvær/Samvær";
import { type BarnebidragSkjema } from "./schema";
import { sporKalkulatorSpørsmålBesvart } from "./utils";

type Props = {
  barnIndex: number;
  onFjernBarn?: () => void;
};

export const EnkeltbarnSkjema = ({ barnIndex, onFjernBarn }: Props) => {
  const { t } = useOversettelse();
  const form = useFormContext<BarnebidragSkjema>();

  const barnField = useFormScope(form.scope(`barn[${barnIndex}]`));

  const overskrift = t(tekster.overskrift.barn(barnIndex + 1));

  return (
    <fieldset className="p-0 space-y-4">
      <legend className="sr-only">{overskrift}</legend>
      <Box width="13rem">
        <Årstallvelger
          {...barnField.field("fødselsår").getInputProps({
            label: t(tekster.fødselsår.label),
            defaultOptionTekst: t(tekster.fødselsår.velgÅrstall),
            onBlur: sporKalkulatorSpørsmålBesvart(
              "barn-fødselsår",
              t(tekster.fødselsår.label),
            ),
          })}
          error={barnField.field("fødselsår").error()}
        />
      </Box>

      <Samvær barnIndex={barnIndex} />

      {onFjernBarn && (
        <Button
          type="button"
          size="small"
          variant="secondary"
          onClick={onFjernBarn}
          icon={<PersonCrossIcon aria-hidden />}
        >
          {t(tekster.fjernBarn)}
        </Button>
      )}
    </fieldset>
  );
};

const tekster = definerTekster({
  overskrift: {
    barn: (nummer) => ({
      nb: `Barn ${nummer}`,
      en: `Child ${nummer}`,
      nn: `Barn ${nummer}`,
    }),
  },
  fødselsår: {
    label: {
      nb: "Hvilket år er barnet født?",
      en: "What year was the child born?",
      nn: "Kva år er barnet fødd?",
    },
    velgÅrstall: {
      nb: "Velg årstall",
      en: "Select year",
      nn: "Vel årstal",
    },
  },
  fjernBarn: {
    nb: "Fjern barn",
    en: "Remove child",
    nn: "Fjern barn",
  },
});
