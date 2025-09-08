import { BodyShort } from "@navikt/ds-react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { BoforholdEnkeltPart } from "./BoforholdEnkeltPart";

export const Bofohold = () => {
  const { t } = useOversettelse();

  return (
    <div className="border p-4 rounded-md">
      <fieldset className="p-0 flex flex-col gap-4">
        <legend className="text-xl mb-2">{t(tekster.overskrift)}</legend>
        <BodyShort size="medium" textColor="subtle">
          {t(tekster.beskrivelse)}
        </BodyShort>
        <BoforholdEnkeltPart part="deg" />
        <hr className="my-4 border-gray-300" />
        <BoforholdEnkeltPart part="medforelder" />
      </fieldset>
    </div>
  );
};

const tekster = definerTekster({
  overskrift: {
    nb: "Bosituasjon",
    en: "Living situation",
    nn: "Bustadssituasjon",
  },
  beskrivelse: {
    nb: "Det påvirker barnebidraget hvis forelderen som skal betale bidraget, bor sammen med flere, egne barn, i tillegg til barna du vil regne ut bidrag for i denne kalkulatoren.",
    en: "It affects the child support amount if the parent who is to pay the support lives with other of their own children, apart from the children you want to calculate support for in this calculator.",
    nn: "Det påverkar fostringstilskotet viss forelderen som skal betale tilskotet, bur saman med fleire, eigne barn, i tillegg til barna du vil rekne ut tilskot for i denne kalkulatoren.",
  },
});
