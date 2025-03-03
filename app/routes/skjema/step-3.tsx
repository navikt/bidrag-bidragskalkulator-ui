import type { MetaFunction } from "react-router";
import Step3 from "~/features/form/Step3";

export default function Step3Route() {
  return <Step3 />;
}

export const meta: MetaFunction = () => {
  return [
    {
      title: "Skjema - Steg 3",
    },
  ];
};
