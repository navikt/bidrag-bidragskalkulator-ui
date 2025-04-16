import { useFormContext } from "@rvf/react";
import { useOversettelse, definerTekster } from "~/utils/i18n";
import type { InnloggetSkjema } from "./schema";
import { usePersoninformasjon } from "./usePersoninformasjon";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { tilInnloggetBarnSkjema } from "./utils";

export function Motpart() {
  const personinformasjon = usePersoninformasjon();
  const form = useFormContext<InnloggetSkjema>();
  const { t } = useOversettelse();

  const { onChange, ...formInputProps } = form.getInputProps("motpartIdent");

  const onChangeMotpart = (motpartIdent: string) => {
    const barnRelasjon = personinformasjon.barnRelasjon.find(
      (relasjon) => relasjon.motpart?.ident === motpartIdent
    );

    const fellesBarn = barnRelasjon?.fellesBarn ?? [];
    const barnFormValue = fellesBarn.map(tilInnloggetBarnSkjema);

    // TODO Reset form errors
    form.setValue("barn", barnFormValue);
    form.setValue("motpartInntekt", "");
    onChange?.(motpartIdent);
  };

  if (personinformasjon.barnRelasjon.length === 1) {
    return null;
  }

  return (
    <RadioGroup
      {...formInputProps}
      legend={t(tekster.velgMotpart.label)}
      onChange={onChangeMotpart}
      error={form.field("motpartIdent").error()}
    >
      {personinformasjon.barnRelasjon.map((relasjon) => (
        <Radio key={relasjon.motpart?.ident} value={relasjon.motpart?.ident}>
          {relasjon.motpart?.fulltNavn}
        </Radio>
      ))}
    </RadioGroup>
  );
}

const tekster = definerTekster({
  velgMotpart: {
    label: {
      nb: "Velg medforelder",
      en: "Select co-parent",
      nn: "Velg medforelder",
    },
  },
});
