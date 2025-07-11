import { PlusIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import { useField, useFieldArray, useFormContext } from "@rvf/react";
import React from "react";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import type { ManueltSkjema } from "../schema";
import { EnkeltbarnSkjema } from "./EnkeltbarnSkjema";

export const ManuellBarnSkjema = () => {
  const { t } = useOversettelse();
  const form = useFormContext<ManueltSkjema>();

  const barnArray = useFieldArray(form.scope("barn"));
  const sisteBarn = useField(form.scope(`barn[${barnArray.length() - 1}]`));
  const antallBarn = barnArray.length();

  const handleLeggTilBarn = () => {
    barnArray.push({
      navn: "",
      alder: "",
      bosted: sisteBarn.value().bosted,
      samvær: sisteBarn.value().samvær,
      barnetilsynsutgift: "",
    });
    sporHendelse({
      hendelsetype: "barn lagt til",
      skjemaId: "barnebidragskalkulator-under-18",
      skjemanavn: "Kalkulator barnebidrag under 18 år",
      antall: barnArray.length() + 1,
    });

    setTimeout(() => {
      const nyttBarnIndex = barnArray.length();
      finnFokuserbartInputPåBarn(nyttBarnIndex)?.focus();
    }, 0);
  };

  const handleFjernBarn = (index: number) => {
    barnArray.remove(index);
    sporHendelse({
      hendelsetype: "barn fjernet",
      skjemaId: "barnebidragskalkulator-under-18",
      skjemanavn: "Kalkulator barnebidrag under 18 år",
      antall: barnArray.length() - 1,
    });

    setTimeout(() => {
      // Dette er den gamle lengden – den blir ikke oppdatert av en eller annen grunn
      const antallBarnFørSletting = barnArray.length();
      if (antallBarnFørSletting > 1) {
        const sisteIndex = antallBarnFørSletting - 2;
        finnFokuserbartInputPåBarn(sisteIndex)?.focus();
      }
    }, 0);
  };

  const medforelderNavnField = form.field("medforelder.navn");
  const medforelderNavn = medforelderNavnField.touched()
    ? medforelderNavnField.value()
    : "";

  return (
    <div className="border p-4 rounded-md space-y-4">
      <fieldset className="p-0">
        <legend className="text-xl mb-6">
          {t(tekster.overskrift(medforelderNavn))}
        </legend>
        {barnArray.map((key, _, index) => {
          return (
            <React.Fragment key={key}>
              <EnkeltbarnSkjema
                barnIndex={index}
                onFjernBarn={
                  antallBarn > 1 ? () => handleFjernBarn(index) : undefined
                }
              />
              <hr className="my-8 border-gray-300" />
            </React.Fragment>
          );
        })}

        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={handleLeggTilBarn}
          icon={<PlusIcon aria-hidden />}
        >
          {t(tekster.leggTilBarn)}
        </Button>
      </fieldset>
    </div>
  );
};

// Dette er en hjelpefunksjon for å finne det første fokuserbare input-elementet på et barn
// Man burde egentlig brukt refs til det, men jeg klarer ikke å forstå hvordan man skal få det til med
// react-validated-form
const finnFokuserbartInputPåBarn = (index: number) => {
  return document.querySelector(
    `input[name="barn[${index}].alder"]`,
  ) as HTMLInputElement;
};

const tekster = definerTekster({
  overskrift: (navn) => ({
    nb: `Felles barn med ${navn || "den du ønsker å avtale barnebidrag med"}`,
    en: `Shared children with ${navn || "the parent you want to agree on child support with"}`,
    nn: `Felles barn med ${navn || "den du ønsker å avtale fostringstilskot med"}`,
  }),
  leggTilBarn: {
    nb: "Legg til barn",
    en: "Add child",
    nn: "Legg til barn",
  },
});
