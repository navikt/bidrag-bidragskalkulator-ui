import { Heading } from "@navikt/ds-react";
import { Outlet } from "react-router";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export default function PrivatAvtaleLayout() {
  const { t } = useOversettelse();

  return (
    <div className="max-w-xl mx-auto p-4 mt-8 flex flex-col gap-4">
      <Heading size="xlarge" level="1" spacing>
        {t(tekster.overskrift)}
      </Heading>
      <Outlet />
    </div>
  );
}

const tekster = definerTekster({
  overskrift: {
    nb: "Barnebidrag - lag privat avtale",
    en: "Child support - create private agreement",
    nn: "Fostringstilskot - lag privat avtale",
  },
});
