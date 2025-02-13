import { BodyShort, GuidePanel, Heading, List, Page } from "@navikt/ds-react";
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
      <Heading size="xlarge" level="1" spacing align="center" className="mt-6">
        Bidragskalkulator
      </Heading>
      <GuidePanel poster>
        <div className="space-y-4">
          <BodyShort>
            Bidragskalkulatoren er et verktøy som hjelper deg å beregne
            barnebidrag. Barnebidrag er et månedlig beløp som skal dekke
            utgifter til barnets daglige liv og oppvekst.
          </BodyShort>
          <BodyShort>
            For å beregne bidraget trenger du informasjon om:
          </BodyShort>
          <List>
            <List.Item>Inntekten til begge foreldrene</List.Item>
            <List.Item>Samværsordningen mellom foreldre og barn</List.Item>
            <List.Item>Andre barn som bor fast hos en av foreldrene</List.Item>
            <List.Item>Eventuelle særlige utgifter til barnet</List.Item>
          </List>
        </div>
      </GuidePanel>
    </Page.Block>
  );
}
