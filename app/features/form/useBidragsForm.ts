import { useForm } from "@rvf/react-router";
import { type RefObject } from "react";
import { useSearchParams } from "react-router";
import { sporHendelse } from "~/utils/analytics";
import { useOversettelse } from "~/utils/i18n";
import { lagValidatorMedSpråk } from "./validator";

const hentVerdierFraSearchParams = (searchParams: URLSearchParams) => {
  const barn: Array<{ alder: string; samværsgrad: string; bostatus: string }> =
    [];
  let currentIndex = 0;

  while (searchParams.has(`barn[${currentIndex}].alder`)) {
    barn.push({
      alder: searchParams.get(`barn[${currentIndex}].alder`) || "",
      samværsgrad:
        searchParams.get(`barn[${currentIndex}].samværsgrad`) || "15",
      bostatus: searchParams.get(`barn[${currentIndex}].bostatus`) || "",
    });
    currentIndex++;
  }

  return {
    barn:
      barn.length > 0 ? barn : [{ alder: "", samværsgrad: "15", bostatus: "" }],
    inntektForelder1: searchParams.get("inntektForelder1") || "",
    inntektForelder2: searchParams.get("inntektForelder2") || "",
  };
};

export const useBidragsform = (
  resultatRef: RefObject<HTMLDivElement | null>
) => {
  const { språk } = useOversettelse();
  const validator = lagValidatorMedSpråk(språk);
  const [searchParams] = useSearchParams();

  const searchParamsVerdier = hentVerdierFraSearchParams(searchParams);

  // Valider at verdiene fra URL-en er gyldige
  let defaultValues = {
    barn: [{ alder: "", samværsgrad: "15", bostatus: "" }],
    inntektForelder1: "",
    inntektForelder2: "",
  };

  try {
    validator.validate(searchParamsVerdier);
    defaultValues = searchParamsVerdier;
  } catch (e) {
    // Bruk standard verdier hvis URL-parametrene er ugyldige
    sporHendelse("skjema validering feilet", {
      kilde: "url-parametere",
      feil: String(e),
    });
  }

  const form = useForm({
    validator,
    submitSource: "state",
    method: "post",
    defaultValues,
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
