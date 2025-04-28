import { useRouteLoaderData } from "react-router";
import type { loader } from "~/routes/index";

export const usePersoninformasjon = () => {
  const loaderData = useRouteLoaderData<typeof loader>("routes/index");

  if (!loaderData) {
    throw new Error("Loader data ikke funnet");
  }

  return loaderData;
};
