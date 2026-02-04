import { PlusIcon } from "@navikt/aksel-icons";
import { BodyShort, Button, Heading } from "@navikt/ds-react";
import { useFieldArray, useFormContext } from "@rvf/react";
import React, { useEffect, useMemo } from "react";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { EnkeltbarnSkjema } from "./EnkeltbarnSkjema";
import type { BarnebidragSkjema } from "./schema";
import { beregnBidragstypeForAlleBarn } from "./utils";

export const FellesBarnSkjema = () => {
  const { t } = useOversettelse();
  const form = useFormContext<BarnebidragSkjema>();

  const barnArray = useFieldArray(form.scope("barn"));
  const antallBarn = barnArray.length();

  const barn = form.value("barn");
  const degInntekt = Number(form.value("deg.inntekt"));
  const medforelderInntekt = Number(form.value("medforelder.inntekt"));

  const bidragstype = useMemo(
    () => beregnBidragstypeForAlleBarn(barn, degInntekt, medforelderInntekt),
    [barn, degInntekt, medforelderInntekt],
  );

  useEffect(() => {
    const forrigeBidragstype = form.value("bidragstype");

    if (forrigeBidragstype !== bidragstype) {
      form.setValue("bidragstype", bidragstype);
    }
  }, [bidragstype, form]);

  const handleLeggTilBarn = () => {
    const sisteIndex = barnArray.length() - 1;
    const sisteBarn = form.transient.value(
      `barn[${sisteIndex}]`,
    ) as BarnebidragSkjema["barn"][number];

    barnArray.push({
      fødselsår: "",
      bosted: sisteBarn.bosted,
      samvær: sisteBarn.samvær,
      harBarnetilsynsutgift: "undefined",
      mottarStønadTilBarnetilsyn: "undefined",
      barnetilsynsutgift: "",
      barnepassSituasjon: "",
      inntektPerMåned: "",
    });
    sporHendelse({
      hendelsetype: "barn lagt til",
      skjemaId: "barnebidragskalkulator-under-18",
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

  return (
    <div className="border p-4 rounded-md space-y-4">
      <Heading level="2" size="medium" spacing>
        {t(tekster.overskrift)}
      </Heading>
      <fieldset className="p-0" aria-describedby="barn-skjema-desc">
        <legend className="sr-only">{t(tekster.overskrift)}</legend>
        <BodyShort
          id="barn-skjema-desc"
          size="medium"
          className="navds-fieldset__description mb-5"
        >
          {t(tekster.beskrivelse)}
        </BodyShort>
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
          variant="primary"
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
    `select[name="barn[${index}].fødselsår"]`,
  ) as HTMLSelectElement;
};

const tekster = definerTekster({
  overskrift: {
    nb: "Barn du ønsker å avtale barnebidrag for",
    en: "Children you wish to arrange child support for",
    nn: "Barn du ønskjer å avtale barnebidrag for",
  },
  beskrivelse: {
    nb: "Hvis dere har flere felles barn dere skal avtale barnebidrag for, kan du legge til flere barn ved å klikke på «Legg til barn» under",
    en: "If you have several children for whom you need to agree on child support, you can add more children by clicking “Add child” below",
    nn: "Viss de har fleire felles barn de skal avtale barnebidrag for, kan du legge til fleire barn ved å klikke på «Legg til barn» nedanfor.",
  },
  leggTilBarn: {
    nb: "Legg til barn",
    en: "Add child",
    nn: "Legg til barn",
  },
});
