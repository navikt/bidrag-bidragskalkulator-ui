import { PlusIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import { useFieldArray } from "@rvf/react";
import React from "react";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { PrivatAvtaleEnkeltbarnSkjema } from "./PrivatAvtaleEnkeltbarn";
import { usePrivatAvtaleForm } from "./PrivatAvtaleFormProvider";

export const PrivatAvtaleBarn = () => {
  const { t } = useOversettelse();
  const { form } = usePrivatAvtaleForm();

  const barnArray = useFieldArray(form.scope("steg2.barn"));
  const antallBarn = barnArray.length();
  const bidragstype = form.value("steg2.barn[0].bidragstype");

  const handleLeggTilBarn = () => {
    barnArray.push({
      ident: "",
      fulltNavn: "",
      sum: "",
      bidragstype: bidragstype ?? "",
    });
    sporHendelse({
      hendelsetype: "barn lagt til",
      skjemaId: "barnebidrag-privat-avtale-under-18",
      antall: antallBarn + 1,
    });

    setTimeout(() => {
      finnFokuserbartInputPåBarn(antallBarn)?.focus();
    }, 0);
  };

  const handleFjernBarn = (index: number) => {
    barnArray.remove(index);
    sporHendelse({
      hendelsetype: "barn fjernet",
      skjemaId: "barnebidrag-privat-avtale-under-18",
      antall: antallBarn - 1,
    });

    setTimeout(() => {
      if (antallBarn > 1) {
        const sisteIndex = antallBarn - 2;
        finnFokuserbartInputPåBarn(sisteIndex)?.focus();
      }
    }, 0);
  };

  return (
    <div>
      {barnArray.map((key, _, index) => {
        return (
          <React.Fragment key={key}>
            <PrivatAvtaleEnkeltbarnSkjema
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
    </div>
  );
};

// Dette er en hjelpefunksjon for å finne det første fokuserbare input-elementet på et barn
// Man burde egentlig brukt refs til det, men jeg klarer ikke å forstå hvordan man skal få det til med
// react-validated-form
const finnFokuserbartInputPåBarn = (index: number) => {
  return document.querySelector(
    `input[name="barn[${index}].fornavn"]`,
  ) as HTMLInputElement;
};

const tekster = definerTekster({
  overskrift: {
    nb: "Felles barn med den du ønsker å avtale barnebidrag med",
    en: "Shared children with the parent you want to agree on child support with",
    nn: "Felles barn med den du ønsker å avtale fostringstilskot med",
  },
  leggTilBarn: {
    nb: "Legg til barn",
    en: "Add child",
    nn: "Legg til barn",
  },
});
