import { useRouteLoaderData } from "react-router";
import { type Personinformasjon } from "./schema";

export const usePersoninformasjon = () => {
  const loaderData = useRouteLoaderData<Personinformasjon>("routes/index");

  if (!loaderData) {
    throw new Error("Loader data ikke funnet");
  }

  return loaderData;
};
