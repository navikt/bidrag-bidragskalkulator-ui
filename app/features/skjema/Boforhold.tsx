import { BodyShort } from "@navikt/ds-react";
import { useFormContext } from "@rvf/react";
import { useEffect, useMemo } from "react";
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
      const nyBidragstype = kalkulerBidragstype(
        result.data,
        degInntekt,
        medforelderInntekt,
      );

      return nyBidragstype;
    }

    return "BEGGE";
  }, [barn, degInntekt, medforelderInntekt]);

  useEffect(() => {
    const forrigeBidragstype = form.value("bidragstype");

    if (forrigeBidragstype !== bidragstype) {
      form.setValue("bidragstype", bidragstype);

      // Resett ikke-påkrevde boforhold når bidragstype endres
      if (bidragstype === "MOTTAKER") {
        // Kun medforelderBoforhold er påkrevd, resett dittBoforhold
        form.setValue("dittBoforhold.borMedAnnenVoksen", "");
        form.setValue("dittBoforhold.borMedAndreBarn", "");
        form.setValue("dittBoforhold.antallBarnBorFast", "");
        form.setValue("dittBoforhold.antallBarnDeltBosted", "");
      } else if (bidragstype === "PLIKTIG") {
        // Kun dittBoforhold er påkrevd, resett medforelderBoforhold
        form.setValue("medforelderBoforhold.borMedAnnenVoksen", "");
        form.setValue("medforelderBoforhold.borMedAndreBarn", "");
        form.setValue("medforelderBoforhold.antallBarnBorFast", "");
        form.setValue("medforelderBoforhold.antallBarnDeltBosted", "");
      }
      // Hvis bidragstype === "BEGGE", behold begge boforhold
    }
  }, [bidragstype, form]);

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

        <div style={{ display: bidragstype === "PLIKTIG" || bidragstype === "BEGGE" ? "block" : "none" }}>
          <BoforholdEnkeltPart part="deg" />
        </div>

        {bidragstype === "BEGGE" && <hr className="my-4 border-gray-300" />}

        <div style={{ display: bidragstype === "MOTTAKER" || bidragstype === "BEGGE" ? "block" : "none" }}>
          <BoforholdEnkeltPart part="medforelder" />
        </div>
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
