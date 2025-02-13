import { BodyShort, GuidePanel, Page } from "@navikt/ds-react";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bidragskalkulator" },
    {
      name: "description",
      content:
        "Bidragskalkulatoren hjelper deg å regne ut hvor stort et barnebidrag er.",
    },
  ];
}

export default function Home() {
  return (
    <Page.Block>
      <h1>Bidragskalkulator</h1>
      <GuidePanel poster className="max-w-xl mx-auto">
        <div className="space-y-4">
          <BodyShort>
            Bidragskalkulatoren er et verktøy som hjelper deg å beregne
            barnebidrag. Barnebidrag er et månedlig beløp som skal dekke
            utgifter til barnets daglige liv og oppvekst.
          </BodyShort>
          <BodyShort>
            For å beregne bidraget trenger du informasjon om:
          </BodyShort>
          <ul className="list-disc list-inside space-y-2">
            <li>Inntekten til begge foreldrene</li>
            <li>Samværsordningen mellom foreldre og barn</li>
            <li>Andre barn som bor fast hos en av foreldrene</li>
            <li>Eventuelle særlige utgifter til barnet</li>
          </ul>
        </div>
      </GuidePanel>
      <BodyShort>Tjenesten er under utvikling.</BodyShort>
    </Page.Block>
  );
}
