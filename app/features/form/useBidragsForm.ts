import { useForm } from "@rvf/react-router";
import { type RefObject } from "react";
import { sporHendelse } from "~/utils/analytics";
import { useOversettelse } from "~/utils/i18n";
import { useValiderteSøkeparametre } from "./useValiderteSøkeparametre";
import { lagValidatorMedSpråk, søkeparametreSchema } from "./validator";

export const useBidragsform = (
  resultatRef: RefObject<HTMLDivElement | null>
) => {
  const { språk } = useOversettelse();
  const validator = lagValidatorMedSpråk(språk);

  const validerteSøkeparametre = useValiderteSøkeparametre(søkeparametreSchema);

  // Valider at verdiene fra URL-en er gyldige
  let defaultValues = {
    barn: [{ alder: "", samværsgrad: "15", bostatus: "" }],
    inntektForelder1: "",
    inntektForelder2: "",
  };

  const form = useForm({
    validator,
    submitSource: "state",
    method: "post",
    defaultValues: validerteSøkeparametre ?? defaultValues,
    onSubmitSuccess: () => {
      resultatRef.current?.focus({ preventScroll: true });
      resultatRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      sporHendelse("skjema fullført");
    },
    onInvalidSubmit: () => {
      sporHendelse("skjema validering feilet", {
        førsteFeil:
          document.activeElement instanceof HTMLInputElement
            ? document.activeElement.name
            : null,
      });
    },
    onSubmitFailure: (error) => {
      sporHendelse("skjema innsending feilet", { feil: String(error) });
    },
  });
  return form;
};
