import { type FormApi } from "@rvf/react";
import { useEffect } from "react";
import type { BarnebidragSkjema } from "../schema";

export function useTilbakestillBoforholdFelter(
  form: FormApi<BarnebidragSkjema>,
  skjemagruppe: "dittBoforhold" | "medforelderBoforhold",
  harVoksneOver18: boolean,
  harEgneBarnOver18: boolean,
  harBarnOver18Vgs: boolean,
) {
  useEffect(() => {
    // Reset når harVoksneOver18 er false
    if (!harVoksneOver18) {
      form.resetField(`${skjemagruppe}.voksneOver18Type`);
      form.resetField(`${skjemagruppe}.harBarnOver18Vgs`);
      form.resetField(`${skjemagruppe}.antallBarnOver18Vgs`);
      return;
    }

    // Reset når harEgneBarnOver18 er false
    if (!harEgneBarnOver18) {
      form.resetField(`${skjemagruppe}.harBarnOver18Vgs`);
      form.resetField(`${skjemagruppe}.antallBarnOver18Vgs`);
      return;
    }

    // Reset når harBarnOver18Vgs er false
    if (!harBarnOver18Vgs) {
      form.resetField(`${skjemagruppe}.antallBarnOver18Vgs`);
    }
  }, [
    harVoksneOver18,
    harEgneBarnOver18,
    harBarnOver18Vgs,
    form,
    skjemagruppe,
  ]);
}
