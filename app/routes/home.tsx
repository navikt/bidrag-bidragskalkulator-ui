import { BodyShort, Page } from "@navikt/ds-react";
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
      <div className="space-y">
        <BodyShort>
          Bidragskalkulatoren hjelper deg å regne ut hvor stort et barnebidrag
          er.
        </BodyShort>
        <BodyShort>Tjenesten er under utvikling.</BodyShort>
      </div>
    </Page.Block>
  );
}
