import { BodyShort, Heading } from "@navikt/ds-react";
import { useFormContext } from "@rvf/react";
import { useEffect } from "react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { BoforholdEnkeltPart } from "./BoforholdEnkeltPart";
import { type BarnebidragSkjema } from "./schema";

const BOFORHOLD_FIELDS = [
  "borMedAnnenVoksen",
  "borMedAndreBarn",
  "antallBarnBorFast",
  "borMedAnnenVoksenType",
  "borMedBarnOver18",
  "antallBarnOver18",
  "andreBarnebidragerPerMåned",
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
        const value =
          field.includes("antall") ||
          field.includes("barnebidrag") ||
          field === "borMedAnnenVoksenType"
            ? ""
            : "undefined";
        form.setValue(`dittBoforhold.${field}`, value);
      });
    } else if (bidragstype === "PLIKTIG") {
      // Kun dittBoforhold er påkrevd, resett medforelderBoforhold
      BOFORHOLD_FIELDS.forEach((field) => {
        const value =
          field.includes("antall") ||
          field.includes("barnebidrag") ||
          field === "borMedAnnenVoksenType"
            ? ""
            : "undefined";
        form.setValue(`medforelderBoforhold.${field}`, value);
      });
    }
  }, [bidragstype, form]);

  if (bidragstype === "") {
    return null;
  }

  return (
    <div className="border p-4 rounded-md">
      <Heading level="2" size="small" spacing>
        {t(tekster[bidragstype].overskrift)}
      </Heading>
      <fieldset className="p-0 flex flex-col gap-4">
        <legend className="sr-only">
          {t(tekster[bidragstype].overskrift)}
        </legend>
        <BodyShort size="medium" textColor="subtle">
          {t(tekster[bidragstype].beskrivelse)}
        </BodyShort>

        {bidragstype === "PLIKTIG" && <BoforholdEnkeltPart part="deg" />}

        {bidragstype === "MOTTAKER" && (
          <BoforholdEnkeltPart part="medforelder" />
        )}
      </fieldset>
    </div>
  );
};

const tekster = definerTekster({
  PLIKTIG: {
    overskrift: {
      nb: "Din bosituasjon og andre egne barn",
      en: "Your living situation and other own children",
      nn: "Din busituasjon og andre eigne barn",
    },
    beskrivelse: {
      nb: "Med andre egne barn mener vi barn du ikke skal avtale barnebidrag med for nå",
      en: "By other own children, we mean children you are not going to arrange child support for at the moment.",
      nn: "Med andre eigne barn meiner vi barn du ikkje skal avtale barnebidrag med for no",
    },
  },
  MOTTAKER: {
    overskrift: {
      nb: "Den andre forelderens bosituasjon og andre egne barn",
      en: "The other parent's living situation and other own children",
      nn: "Den andre forelderen sin busituasjon og andre eigne barn",
    },
    beskrivelse: {
      nb: "Med andre egne barn mener vi barn du ikke skal avtale barnebidrag med for nå",
      en: "By other own children, we mean children you are not going to arrange child support for at the moment.",
      nn: "Med andre eigne barn meiner vi barn du ikkje skal avtale barnebidrag med for no",
    },
  },
});
