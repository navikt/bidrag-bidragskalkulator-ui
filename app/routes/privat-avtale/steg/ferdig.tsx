import { Button, Heading } from "@navikt/ds-react";
import { data, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { getSession, PRIVAT_AVTALE_SESSION_KEY } from "~/config/session.server";
import { PrivatAvtaleFlerstegsSkjemaSchema } from "~/features/privatAvtale/skjemaSchema";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export default function FerdigSteg() {
  const loaderData = useLoaderData<typeof loader>();
  const { t } = useOversettelse();
  return (
    <div>
      <Heading level="2" size="xlarge">
        Nedlastningen din starter snart
      </Heading>
      <p>
        Hvis nedlastningen ikke starter automatisk, kan du gå tilbake til
        forrige side og prøve igjen.
      </p>
      <ul />
      <Heading level="3" size="large">
        Hva gjør vi nå?
      </Heading>
      <p>
        Når dere har skrevet ut avtalen, kan dere signere den og arkivere den
        for eget bruk.
      </p>
      <p>
        Siden dere ønsker at Skatteetaten skal innkreve avtalen, må dere sende
        en underskrevet kopi til Nav.
      </p>
      <Button
        as="a"
        variant="primary"
        size="medium"
        href="https://www.nav.no/fyllut-ettersending/nav550060/innsendingsvalg"
      >
        Send inn undertegnet avtale
      </Button>
    </div>
  );
}

const tekster = definerTekster({});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionData = session.get(PRIVAT_AVTALE_SESSION_KEY) ?? null;
  const resultat =
    PrivatAvtaleFlerstegsSkjemaSchema.partial().safeParse(sessionData);
  if (!resultat.success) {
    return {};
  }
  return data(resultat.data, { headers: { "Cache-Control": "no-store" } });
};
