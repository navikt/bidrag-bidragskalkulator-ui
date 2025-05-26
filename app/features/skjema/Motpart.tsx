import { Radio, RadioGroup } from "@navikt/ds-react";
import { useFormContext } from "@rvf/react";
import { definerTekster, Språk, useOversettelse } from "~/utils/i18n";
import type { Barn } from "./personinformasjon/schema";
import { usePersoninformasjon } from "./personinformasjon/usePersoninformasjon";
import type { InnloggetSkjema } from "./schema";
import { tilInnloggetBarnSkjema } from "./utils";

const hentBeskrivelseBarn = (barn: Barn[], språk: Språk) => {
  const fornavn = barn.map((barn) => barn.fornavn);

  // Create a formatter that uses "og" between the last two items and commas between the rest
  const formatter = new Intl.ListFormat(
    språk === Språk.NorwegianNynorsk ? Språk.NorwegianBokmål : språk,
    {
      style: "long",
      type: "conjunction",
    },
  );

  return formatter.format(fornavn);
};

export function Motpart() {
  const personinformasjon = usePersoninformasjon();
  const form = useFormContext<InnloggetSkjema>();
  const { t, språk } = useOversettelse();

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
          {hentBeskrivelseBarn(relasjon.fellesBarn, språk)}
        </Radio>
      ))}
    </RadioGroup>
  );
}

const tekster = definerTekster({
  velgMotpart: {
    label: {
      nb: "Velg hvilke barn du vil beregne barnebidrag for",
      nn: "Velg kva barn du vil rekne ut fostringstilskot for",
      en: "Select which children you want to calculate child support for",
    },
  },
});
