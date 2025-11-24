import { BodyShort } from "@navikt/ds-react";
import { useFormContext } from "@rvf/react";
import { useEffect } from "react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { BoforholdEnkeltPart } from "./BoforholdEnkeltPart";
import { type BarnebidragSkjema } from "./schema";

const BOFORHOLD_FIELDS = [
  "borMedAnnenVoksen",
  "borMedAndreBarn",
  "antallBarnBorFast",
  "betalerBarnebidrageForAndreBarn",
  "borMedAnnenVoksenType",
] as const;

export const Bofohold = () => {
  const form = useFormContext<BarnebidragSkjema>();
  const { t } = useOversettelse();
  const bidragstype = form.value("bidragstype");

  useEffect(() => {
    // Resett ikke-påkrevde boforhold når bidragstype endres
    if (bidragstype === "MOTTAKER") {
      // Kun medforelderBoforhold er påkrevd, resett dittBoforhold
      BOFORHOLD_FIELDS.forEach((field) => {
        form.setValue(`dittBoforhold.${field}`, "");
      });
    } else if (bidragstype === "PLIKTIG") {
      // Kun dittBoforhold er påkrevd, resett medforelderBoforhold
      BOFORHOLD_FIELDS.forEach((field) => {
        form.setValue(`medforelderBoforhold.${field}`, "");
      });
    }
    // Hvis bidragstype === "BEGGE", behold begge boforhold
  }, [bidragstype, form]);

  if (bidragstype === "") {
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

        <div
          className={
            bidragstype === "PLIKTIG" || bidragstype === "BEGGE"
              ? "block"
              : "hidden"
          }
        >
          <BoforholdEnkeltPart part="deg" />
        </div>

        {bidragstype === "BEGGE" && <hr className="my-4 border-gray-300" />}

        <div
          className={
            bidragstype === "MOTTAKER" || bidragstype === "BEGGE"
              ? "block"
              : "hidden"
          }
        >
          <BoforholdEnkeltPart part="medforelder" />
        </div>
      </fieldset>
    </div>
  );
};

const tekster = definerTekster({
  overskrift: {
    nb: "Bosituasjon og andre egne barn",
    en: "",
    nn: "",
  },
  beskrivelse: {
    nb: "Med andre egne barn mener vi barn bidragspliktig ikke skal avtale barnebidrag med for nå",
    en: "",
    nn: "",
  },
});
