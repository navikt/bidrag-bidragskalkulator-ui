import { Heading } from "@navikt/ds-react";
import { Outlet } from "react-router";
import { env } from "~/config/env.server";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export async function loader() {
  if (env.ENVIRONMENT === "prod") {
    throw new Response("Not found", { status: 404 });
  }
  return {};
}

export default function PrivatAvtaleLayout() {
  const { t } = useOversettelse();

  return (
    <div className="max-w-5xl mx-auto p-4 m-10 flex flex-col gap-4">
      <Heading size="xlarge" level="1" spacing>
        {t(tekster.overskrift)}
      </Heading>
      <Outlet />
    </div>
  );
}

const tekster = definerTekster({
  brødsmuler: {
    steg1: {
      label: {
        nb: "Barnebidrag",
        nn: "Barnebidrag",
        en: "Child support",
      },
      url: {
        nb: "https://www.nav.no/barnebidrag",
        nn: "https://www.nav.no/barnebidrag",
        en: "https://www.nav.no/barnebidrag/en",
      },
    },
    steg2: {
      label: {
        nb: "Privat avtale",
        nn: "Privat avtale",
        en: "Private agreement",
      },
      url: {
        nb: "https://www.nav.no/barnebidrag/tjenester/privat-avtale",
        nn: "https://www.nav.no/barnebidrag/tjenester/privat-avtale",
        en: "https://www.nav.no/barnebidrag/tjenester/privat-avtale",
      },
    },
  },
  overskrift: {
    nb: "Barnebidrag - lag privat avtale",
    en: "Child support - create private agreement",
    nn: "Barnebidrag - lag privat avtale",
  },
});

export const handle = {
  brødsmuler: [tekster.brødsmuler.steg1, tekster.brødsmuler.steg2],
};
