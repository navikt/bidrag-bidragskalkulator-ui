import { Button, Heading } from "@navikt/ds-react";
import { data, useLoaderData, type LoaderFunctionArgs } from "react-router";
import type z from "zod";
import { getSession, PRIVAT_AVTALE_SESSION_KEY } from "~/config/session.server";
import { PrivatAvtaleFlerstegsSkjemaSchema } from "~/features/privatAvtale/skjemaSchema";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export default function FerdigSteg() {
  const { t } = useOversettelse();
  const loaderData = useLoaderData<typeof loader>();
  const harInnkreving =
    loaderData.steg3?.avtaledetaljer?.medInnkreving === "true";
  return (
    <div>
      <Heading level="2" size="xlarge">
        {t(tekster.tittel)}
      </Heading>
      <p>{t(tekster.fallback)}</p>
      <ul />
      <Heading level="3" size="large">
        {t(tekster.hvaNå)}
      </Heading>
      <p>{t(tekster.signerOgArkiver)}</p>
      {harInnkreving && (
        <>
          <p>{t(tekster.sendTilNav)}</p>
          <Button
            as="a"
            variant="primary"
            size="medium"
            href="https://www.nav.no/fyllut-ettersending/nav550060/innsendingsvalg"
          >
            {t(tekster.cta)}
          </Button>
        </>
      )}
    </div>
  );
}

const tekster = definerTekster({
  tittel: {
    nb: "Nedlastningen din starter snart",
    nn: "Nedlastinga di startar snart",
    en: "Your download will start shortly",
  },
  fallback: {
    nb: "Hvis nedlastningen ikke starter automatisk, kan du gå tilbake til forrige side og prøve igjen.",
    nn: "Viss nedlastinga ikkje startar automatisk, kan du gå tilbake til førre side og prøve igjen.",
    en: "If your download doesn't start automatically, go back to the previous page and try again.",
  },
  hvaNå: {
    nb: "Hva gjør vi nå?",
    nn: "Kva gjer vi no?",
    en: "What happens next?",
  },
  signerOgArkiver: {
    nb: "Når dere har skrevet ut avtalen, kan dere signere den og arkivere den for eget bruk.",
    nn: "Når de har skrive ut avtalen, kan de signere han og arkivere han for eige bruk.",
    en: "After printing the agreement, sign it and archive it for your own records.",
  },
  sendTilNav: {
    nb: "Siden dere ønsker at Skatteetaten skal innkreve avtalen, må dere sende en underskrevet kopi til Nav.",
    nn: "Sidan de ønskjer at Skatteetaten skal krevje inn avtalen, må de sende ein underskriven kopi til Nav.",
    en: "Since you want the Tax Administration to collect the agreement, you must send a signed copy to NAV.",
  },
  cta: {
    nb: "Send inn undertegnet avtale",
    nn: "Send inn underskriven avtale",
    en: "Submit signed agreement",
  },
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionData = session.get(PRIVAT_AVTALE_SESSION_KEY) ?? null;
  const partialskjema = PrivatAvtaleFlerstegsSkjemaSchema.partial();
  type PartialSkjemaType = z.infer<typeof partialskjema>;
  const resultat = partialskjema.safeParse(sessionData);

  if (resultat.success) {
    return data<PartialSkjemaType>(resultat.data, {
      headers: { "Cache-Control": "no-store" },
    });
  }
  return data<PartialSkjemaType>({});
};
