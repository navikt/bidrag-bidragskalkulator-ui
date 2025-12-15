import {
  createReactRouterV6DataOptions,
  getWebInstrumentations,
  initializeFaro,
  ReactIntegration,
  type Faro,
} from "@grafana/faro-react";
import { useEffect } from "react";
import { matchRoutes, unstable_useRoute } from "react-router";

export function useFaro() {
  const { loaderData } = unstable_useRoute("root");
  const erProd = loaderData?.telemetriUrl.includes("telemetry.nav.no");
  const faroUrl = loaderData?.telemetriUrl;

  useEffect(() => {
    if (erProd && faroUrl) {
      initFaro(faroUrl);
    }
  }, [erProd, faroUrl]);
}

let faro: Faro | null = null;

function initFaro(url: string) {
  if (typeof document === "undefined" || faro !== null) {
    return;
  }

  faro = initializeFaro({
    url,
    app: {
      name: "bidrag-barnebidragskalkulator",
      namespace: "bidrag",
    },
    instrumentations: [
      ...getWebInstrumentations({
        captureConsole: true,
        captureConsoleDisabledLevels: [],
      }),
      new ReactIntegration({
        router: createReactRouterV6DataOptions({
          matchRoutes,
        }),
      }),
    ],
  });
}
