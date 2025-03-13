/**
 * Formatterer et tall som en sum i kroner
 */
export const formatterSum = (sum?: number) => {
  if (sum === undefined) {
    return "";
  }
  return sum.toLocaleString("nb-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
