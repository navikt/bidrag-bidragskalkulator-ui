import { BodyLong, Heading } from "@navikt/ds-react";
import { useField, useFormContext } from "@rvf/react";
import { Fragment } from "react/jsx-runtime";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import {
  MAKS_ALDER_BARNETILSYNSUTGIFT,
  type BarnebidragSkjema,
} from "../schema";
import { kalkulerBidragstype } from "../utils";
import { BarnepassPerBarn } from "./BarnepassPerBarn";

export const Barnepass = () => {
  const form = useFormContext<BarnebidragSkjema>();
  const { t } = useOversettelse();
  const barnField = useField(form.scope("barn"));
  const barn = barnField.value() ?? [];

  const bidragstype = form.value("bidragstype");

  const dinInntekt = form.value("deg.inntekt");
  const medforelderInntekt = form.value("medforelder.inntekt");

  const barnDuErMottakerFor = barn.filter(
    (enkeltBarn) =>
      enkeltBarn.bosted !== "" &&
      kalkulerBidragstype(
        enkeltBarn.bosted,
        Number(dinInntekt),
        Number(medforelderInntekt),
      ) === "MOTTAKER" &&
      Number(enkeltBarn.alder) <= MAKS_ALDER_BARNETILSYNSUTGIFT,
  );

  const barnDuErPliktigFor = barn.filter(
    (enkeltBarn) =>
      enkeltBarn.bosted !== "" &&
      kalkulerBidragstype(
        enkeltBarn.bosted,
        Number(dinInntekt),
        Number(medforelderInntekt),
      ) === "PLIKTIG" &&
      Number(enkeltBarn.alder) <= MAKS_ALDER_BARNETILSYNSUTGIFT,
  );

  const finnBarnIndex = (alder: string) => {
    return barn.findIndex((b) => b.alder === alder);
  };

  if (
    (barnDuErMottakerFor.length === 0 && barnDuErPliktigFor.length === 0) ||
    bidragstype === ""
  ) {
    return null;
  }

  return (
    <div className="border p-6 rounded-lg bg-white space-y-6">
      <Heading level="2" size="small" spacing>
        {t(tekster.overskrift)}
      </Heading>
      <fieldset className="p-0">
        <legend className="sr-only">{t(tekster.overskrift)}</legend>
        <BodyLong spacing size="medium" textColor="subtle">
          {t(tekster.beskrivelse)}
        </BodyLong>

        {barnDuErMottakerFor.map((enkeltBarn, index) => {
          return (
            <Fragment key={index}>
              <BarnepassPerBarn
                barnIndex={finnBarnIndex(enkeltBarn.alder)}
                bidragstype="MOTTAKER"
              />
              {index !== barnDuErMottakerFor.length - 1 && (
                <hr className="my-8 border-gray-300" />
              )}
            </Fragment>
          );
        })}

        {barnDuErPliktigFor.map((enkeltBarn, index) => {
          return (
            <Fragment key={index}>
              <BarnepassPerBarn
                barnIndex={finnBarnIndex(enkeltBarn.alder)}
                bidragstype="PLIKTIG"
              />
              {index !== barnDuErPliktigFor.length - 1 && (
                <hr className="my-8 border-gray-300" />
              )}
            </Fragment>
          );
        })}
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
    nb: "Kalkulatoren regner bare med utgifter til barnepass hos den som skal motta barnebidraget. Derfor legges utgifter til barnepass, alltid til mottakerens del av beregningen, uavhengig av hvem som betaler. Utgiften til barnepass er en del av det totale barnebidraget.",
    en: "The calculator only takes into account childcare expenses for the person who will receive the child support. Therefore, childcare expenses are always added to the recipient's part of the calculation, regardless of who pays. The childcare expense is part of the total child support.",
    nn: "Kalkulatoren reknar berre med utgifter til barnepass hjå den som skal motta barnebidraget. Difor blir utgifter til barnepass alltid lagt til mottakaren sin del av berekninga, uavhengig av kven som betaler. Utgifta til barnepass er ein del av det totale barnebidraget.",
  },
  MOTTAKER: {
    barnepassInformasjon: {
      overskrift: {
        nb: "Betaler den andre forelderen for barnepass?",
        en: "Does the other parent pay for childcare?",
        nn: "Betaler den andre forelderen for barnepass?",
      },
      beskrivelseDel1: {
        nb: "Hvis den andre forelderen betaler for barnepass, legg inn opplysningene slik kalkulatoren ber om. Når kalkulatoren har foreslått et barnebidrag, kan dere for eksempel trekke utgiftene til barnepass  fra forslaget til barnebidrag og justere slik det passer dere.",
        en: "If the other parent pays for childcare, enter the information as the calculator requests. When the calculator has suggested a child support amount, you can, for example, deduct the childcare expenses from the proposed child support and adjust it as it suits you.",
        nn: "Dersom den andre forelderen betaler for barnepass, legg inn opplysningane slik kalkulatoren ber om. Når kalkulatoren har føreslått eit barnebidrag, kan de til dømes trekkje frå utgiftene til barnepass frå forslaget til barnebidrag og justere slik det passar dykk.",
      },
    },
  },
  PLIKTIG: {
    barnepassInformasjon: {
      overskrift: {
        nb: "Betaler du for barnepass?",
        en: "Do you pay for childcare?",
        nn: "Betaler du for barnepass?",
      },
      beskrivelseDel1: {
        nb: "Hvis du betaler for barnepass, legg inn opplysningene slik kalkulatoren ber om. Når kalkulatoren har foreslått et barnebidrag, kan dere for eksempel trekke utgiftene til barnepass  fra forslaget til barnebidrag og justere slik det passer dere.",
        en: "If you pay for childcare, enter the information as the calculator requests. When the calculator has suggested a child support amount, you can, for example, deduct the childcare expenses from the proposed child support and adjust it as it suits you.",
        nn: "Dersom du betaler for barnepass, legg inn opplysningane slik kalkulatoren ber om. Når kalkulatoren har føreslått eit barnebidrag, kan de til dømes trekkje frå utgiftene til barnepass frå forslaget til barnebidrag og justere slik det passar dykk.",
      },
    },
  },
});
