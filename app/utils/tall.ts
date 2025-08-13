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
 * Sjekker om en string er et gyldig tall
 */
export const erGyldigTall = (verdi: string): boolean => {
  if (!verdi || verdi.trim() === "") {
    return false;
  }
  const tall = Number(verdi);
  return !isNaN(tall) && isFinite(tall);
};
