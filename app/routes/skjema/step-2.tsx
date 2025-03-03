import type { MetaFunction } from "react-router";
import Step2 from "~/features/form/Step2";

export default function Step2Route() {
  return <Step2 />;
}


export const meta: MetaFunction = () => {
  return [
    {
      title: "Skjema - Steg 2",
    },
  ];
};