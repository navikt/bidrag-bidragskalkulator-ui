import { Radio, RadioGroup } from "@navikt/ds-react";
import { useFormContext } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { usePersoninformasjon } from "./personinformasjon/usePersoninformasjon";
import type { InnloggetSkjema } from "./schema";
import { tilInnloggetBarnSkjema } from "./utils";

export function Motpart() {
  const personinformasjon = usePersoninformasjon();
  const form = useFormContext<InnloggetSkjema>();
  const { t } = useOversettelse();

  const { onChange, ...formInputProps } = form.getInputProps("motpartIdent");

  const vedEndreMotpart = (motpartIdent: string) => {
    const barnRelasjon = personinformasjon.barnerelasjoner.find(
      (relasjon) => relasjon.motpart?.ident === motpartIdent,
    );

    const fellesBarn = barnRelasjon?.fellesBarn ?? [];
    const barnFormValue = fellesBarn.map(tilInnloggetBarnSkjema);

    form.setValue("barn", barnFormValue);
    form.setValue("inntektMotpart", "");
    onChange?.(motpartIdent);
  };

  if (personinformasjon.barnerelasjoner.length === 1) {
    return null;
  }

  return (
    <RadioGroup
      {...formInputProps}
      legend={t(tekster.velgMotpart.label)}
      onChange={vedEndreMotpart}
      error={form.field("motpartIdent").error()}
    >
      {personinformasjon.barnerelasjoner.map((relasjon) => (
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
      nn: "Vel medforelder",
    },
  },
});
