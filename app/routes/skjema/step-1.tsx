import type { MetaFunction } from "react-router";
import Step1 from "~/features/form/Step1";

export default function Step1Route() {
  return <Step1 />;
}

export const meta: MetaFunction = () => {
  return [
    {
      title: "Skjema - Steg 1",
    },
  ];
};
