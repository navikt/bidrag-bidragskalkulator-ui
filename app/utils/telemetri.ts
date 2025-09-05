import {
  type Faro,
  getWebInstrumentations,
  initializeFaro,
  ReactIntegration,
} from "@grafana/faro-react";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";

let faro: Faro;

/**
 * Singleton for Faro-instans.
 *
 * Faro brukes til instrumentering og telemetri og den typen ting i appen.
 */
export function getFaro(telemetriUrl: string): Faro | null {
  if (faro) {
    return faro;
  }
  if (!telemetriUrl) {
    throw new Error("Telemetri URL er ikke satt. Sett TELEMETRY_URL i .env");
  }
  const erProd = telemetriUrl.includes("telemetry.nav.no");
  const erLokalt = location.hostname.includes("localhost");

  if (erLokalt) {
    console.info("Faro er slått av for lokal utvikling");
    return null;
  }

  faro = initializeFaro({
    url: telemetriUrl,
    app: {
      name: "bidrag-barnebidragskalkulator",
      namespace: "bidrag",
      environment: erProd ? "prod-gcp-loki" : "dev-gcp-loki",
    },
    instrumentations: [
      ...getWebInstrumentations({
        captureConsole: false,
      }),
      new TracingInstrumentation(),
      new ReactIntegration(),
    ],
  });
  return faro;
}
