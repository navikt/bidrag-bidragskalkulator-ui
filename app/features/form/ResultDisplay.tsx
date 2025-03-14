import { Alert, BodyLong, Button, Heading, Link } from "@navikt/ds-react";
import { formatterSum } from "~/utils/tall";
import type { FormResponse } from "./validator";

type ResultDisplayProps = {
  data: FormResponse | null;
  ref: React.RefObject<HTMLDivElement | null>;
};

export const ResultDisplay = ({ data, ref }: ResultDisplayProps) => {
  if (!data) {
    return null;
  }

  if ("error" in data) {
    return (
      <div className="mt-6">
        <Alert variant="error">
          <Heading size="small" spacing>
            Noe gikk feil under beregningen
          </Heading>
          <BodyLong>{data.error}</BodyLong>
        </Alert>
      </div>
    );
  }

  const totalSum = data.resultater.reduce((sum, neste) => sum + neste.sum, 0);

  return (
    <div className="mt-6" ref={ref}>
      <Alert variant="info">
        <Heading size="small" spacing>
          Bidraget er {formatterSum(totalSum)} i måneden.
        </Heading>
        {totalSum === 0 && (
          <BodyLong spacing>
            Dette betyr at du ikke skal betale noe i barnebidrag. Det kan være
            fordi dere har delt samvær likt mellom dere, ofte i kombinasjon at
            differansen mellom inntektene deres er lav.
          </BodyLong>
        )}
        <BodyLong spacing>
          For å gjøre det enkelt å komme frem til en omtrentlig sum, er
          kalkuleringen basert på få opplysninger. Det er mange andre faktorer
          som kan påvirke hva man har rett eller plikt til. Du kan bruke den{" "}
          <Link href="https://tjenester.nav.no/bidragskalkulator/innledning?0">
            gamle bidragskalkulatoren
          </Link>{" "}
          for å legge inn flere opplysninger og få en riktigere sum.
        </BodyLong>
        <BodyLong spacing>
          Barnebidraget avtaler du med den andre forelderen eller søker Nav om
          hjelp til å fastsette.
        </BodyLong>
        <div className="flex justify-end gap-4">
          <Button
            as="a"
            href="https://www.nav.no/fyllut/nav550060?sub=paper"
            variant="primary"
          >
            Lag privat avtale
          </Button>
          <Button
            as="a"
            href="https://www.nav.no/start/soknad-barnebidrag-bidragsmottaker"
            variant="secondary"
          >
            Søk Nav om fastsetting
          </Button>
        </div>
      </Alert>
    </div>
  );
};
