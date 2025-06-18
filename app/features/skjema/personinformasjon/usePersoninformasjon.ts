import { useRouteLoaderData } from "react-router";
import type { loader } from "~/routes/med-barn";

export const usePersoninformasjon = () => {
  const loaderData = useRouteLoaderData<typeof loader>("routes/kalkulator");

  if (!loaderData) {
    throw new Error(
      "Kunne ikke finne personinformasjon. Har du endret URL-en til noe annet?",
    );
  }

  return loaderData;
};
