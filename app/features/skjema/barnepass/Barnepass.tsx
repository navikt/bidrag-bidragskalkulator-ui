import { BodyShort } from "@navikt/ds-react";
import { useFormContext } from "@rvf/react";
import { Fragment } from "react/jsx-runtime";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import type { BarnebidragSkjema } from "../schema";
import { BarnepassPerBarn } from "./BarnepassPerBarn";

export const Barnepass = () => {
  const form = useFormContext<BarnebidragSkjema>();
  const { t } = useOversettelse();
  const barn = form.value("barn");
  const bidragstype = form.value("bidragstype");

  if (bidragstype === "PLIKTIG" || bidragstype === "") {
    return null;
  }

  return (
    <div className="border p-6 rounded-lg bg-white space-y-6">
      <h2 className="sr-only">{t(tekster.overskrift)}</h2>
      <fieldset className="p-0">
        <legend className="text-xl mb-2">{t(tekster.overskrift)}</legend>
        <BodyShort size="medium" textColor="subtle" spacing>
          {t(tekster.beskrivelse)}
        </BodyShort>
        {barn.map((_, index) => (
          <Fragment key={index}>
            <BarnepassPerBarn barnIndex={index} />
            {index !== barn.length - 1 && (
              <hr className="my-8 border-gray-300" />
            )}
          </Fragment>
        ))}
      </fieldset>
    </div>
  );
};

const tekster = definerTekster({
  overskrift: {
    nb: "Barnepass",
    en: "Childcare",
    nn: "Barnepass",
  },
  beskrivelse: {
    nb: "Barnepass inkluderer barnehage (uten penger til kost, bleier og lignende), skolefritidsordning (SFO), Aktivitetsskolen (AKS) eller dagmamma. Kostnader for barnepass kalles også tilsynsutgifter.",
    en: "Childcare includes kindergarten (excluding expenses for food, diapers etc), after-school program (SFO), the Activity School (AKS) or nanny. Childcare costs are also referred to as supervision expenses.",
    nn: "Barnepass inkluderer barnehage (utan pengar til kost, bleier og liknande), skulefritidsordning (SFO), Aktivitetsskolen (AKS) eller dagmamma. Kostnadar for barnepass blir óg kalla tilsynsutgifter.",
  },
});
