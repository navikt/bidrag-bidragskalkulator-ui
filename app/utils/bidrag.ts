import type { Bidragstype } from "~/features/skjema/beregning/schema";

export const summerBidrag = <
  Bidrag extends {
    sum: number;
    bidragstype: Bidragstype;
  },
>(
  bidrag: Bidrag[],
): Pick<Bidrag, "sum" | "bidragstype"> => {
  const totalSum = bidrag.reduce((totalSum, neste) => {
    if (neste.bidragstype === "PLIKTIG") {
      return totalSum + neste.sum;
    }
    return totalSum - neste.sum;
  }, 0);

  return {
    sum: Math.abs(totalSum),
    bidragstype: totalSum > 0 ? "PLIKTIG" : "MOTTAKER",
  };
};
