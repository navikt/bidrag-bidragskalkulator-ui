import { useForm } from "@rvf/react-router";
import { type RefObject } from "react";
import { sporHendelse } from "~/utils/analytics";
import { useOversettelse } from "~/utils/i18n";
import { lagValidatorMedSpråk } from "./validator";

export const useBidragsform = (
  resultatRef: RefObject<HTMLDivElement | null>
) => {
  const { språk } = useOversettelse();
  const validator = lagValidatorMedSpråk(språk);
  const form = useForm({
    validator,
    submitSource: "state",
    method: "post",
    defaultValues: {
      barn: [{ alder: "", samværsgrad: "15", bostatus: "" }],
      inntektForelder1: "",
      inntektForelder2: "",
    },
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
