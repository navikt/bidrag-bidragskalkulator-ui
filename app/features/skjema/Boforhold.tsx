import { BodyShort } from "@navikt/ds-react";
import { useFormContext } from "@rvf/react";
import { useMemo } from "react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { BoforholdEnkeltPart } from "./BoforholdEnkeltPart";
import { FastBostedSchema, type BarnebidragSkjema } from "./schema";
import { kalkulerBidragstype } from "./utils";

export const Bofohold = () => {
  const form = useFormContext<BarnebidragSkjema>();
  const { t } = useOversettelse();

  const barn = form.value("barn");
  const degInntekt = Number(form.value("deg.inntekt"));
  const medforelderInntekt = Number(form.value("medforelder.inntekt"));

  const bidragstype = useMemo(() => {
    if (barn.length === 0 || !degInntekt || !medforelderInntekt) {
      return "";
    }

    const førsteBosted = barn[0].bosted;
    const result = FastBostedSchema.safeParse(førsteBosted);

    const harAlleSammeBosted = barn.every((b) => b.bosted === førsteBosted);

    if (harAlleSammeBosted && result.success) {
      return kalkulerBidragstype(result.data, degInntekt, medforelderInntekt);
    }

    return "";
  }, [barn, degInntekt, medforelderInntekt]);

  if (barn.length === 0 || !degInntekt || !medforelderInntekt) {
    return null;
  }

  return (
    <div className="border p-4 rounded-md">
      <h2 className="sr-only">{t(tekster.overskrift)}</h2>
      <fieldset className="p-0 flex flex-col gap-4">
        <legend className="text-xl mb-2">{t(tekster.overskrift)}</legend>
        <BodyShort size="medium" textColor="subtle">
          {t(tekster.beskrivelse)}
        </BodyShort>

        {bidragstype === "PLIKTIG" && <BoforholdEnkeltPart part="deg" />}

        {bidragstype === "MOTTAKER" && (
          <BoforholdEnkeltPart part="medforelder" />
        )}

        {bidragstype === "" && (
          <>
            <BoforholdEnkeltPart part="deg" />
            <hr className="my-4 border-gray-300" />
            <BoforholdEnkeltPart part="medforelder" />
          </>
        )}
      </fieldset>
    </div>
  );
};

const tekster = definerTekster({
  overskrift: {
    nb: "Bosituasjon",
    en: "Living situation",
    nn: "Busituasjon",
  },
  beskrivelse: {
    nb: "Det påvirker barnebidraget hvis forelderen som skal betale bidraget, bor sammen med flere egne barn, i tillegg til barna du vil regne ut bidrag for i denne kalkulatoren.",
    en: "It affects the child support if the parent who is to pay the support lives with several of their own children, in addition to the children you want to calculate support for in this calculator.",
    nn: "Det påverkar barnebidraget viss forelderen som skal betale tilskotet, bur saman med fleire eigne barn, i tillegg til barna du vil rekne ut tilskot for i denne kalkulatoren.",
  },
});
