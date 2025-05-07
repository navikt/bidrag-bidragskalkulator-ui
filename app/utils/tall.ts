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

/**
 * Finner det nærmeste avrundede tallet basert på tierpotens
 * @param tall Tallet som skal avrundes
 * @param tierpotens Bestemmer hvilken tierpotens som skal brukes for avrunding
 * @returns Det nærmeste avrundede tallet
 * @example
 * // Avrunder 1234 til nærmeste 10
 * finnAvrundetTall(1234, 1); // 1230
 * // Avrunder 1234 til nærmeste 1000
 * finnAvrundetTall(1234, 3); // 1000
 */
export const finnAvrundetTall = (tall: number, tierpotens: number) => {
  const factor = Math.pow(10, tierpotens);
  return Math.round(tall / factor) * factor;
};
