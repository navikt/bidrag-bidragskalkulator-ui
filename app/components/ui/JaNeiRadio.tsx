import {
  Radio,
  RadioGroup,
  Stack,
  type RadioGroupProps,
} from "@navikt/ds-react";
import { definerTekster, useOversettelse } from "~/utils/i18n";

const JA_NEI_ALTERNATIVER = ["true", "false"] as const;

type Props = Omit<RadioGroupProps, "children">;

export default function JaNeiRadio(props: Props) {
  const { t } = useOversettelse();

  return (
    <RadioGroup {...props}>
      <Stack gap="0 6" direction={{ xs: "column", sm: "row" }} wrap={false}>
        {JA_NEI_ALTERNATIVER.map((alternativ) => {
          return (
            <Radio
              value={alternativ}
              key={alternativ}
              //   onChange={sporKalkulatorSpørsmålBesvart(
              //     `${part}-bor-med-voksen`,
              //     t(tekster[skjemagruppe].borMedAnnenVoksen.label),
              //   )}
            >
              {t(tekster[alternativ])}
            </Radio>
          );
        })}
      </Stack>
    </RadioGroup>
  );
}

const tekster = definerTekster({
  true: {
    nb: "Ja",
    nn: "Ja",
    en: "Yes",
  },
  false: {
    nb: "Nei",
    nn: "Nei",
    en: "No",
  },
});
