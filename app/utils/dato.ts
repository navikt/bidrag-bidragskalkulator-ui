import { Språk } from "./i18n";

/**
 * @param dato
 * @returns dato som tekststreng på format `YYYY-MM-DD`
 */
export const tilÅrMånedDag = (dato: Date): string => {
  const formatter = new Intl.DateTimeFormat(Språk.NorwegianBokmål, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [{ value: day }, , { value: month }, , { value: year }] =
    formatter.formatToParts(dato);

  return `${year}-${month}-${day}`;
};

/**
 * @param dato som tekststreng
 * @returns `true` hvis `dato` er på formatet `YYYY-MM-DD`, ellers `false`
 */
export const erDatostrengÅrMånedDag = (dato: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dato);
};
