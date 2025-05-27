import { useRouteLoaderData } from "react-router";
import type { loader } from "~/routes/med-barn";

export const usePersoninformasjon = () => {
  const loaderData = useRouteLoaderData<typeof loader>("routes/index");

  if (!loaderData) {
    throw new Error("Loader data ikke funnet");
  }

  return loaderData;
};
