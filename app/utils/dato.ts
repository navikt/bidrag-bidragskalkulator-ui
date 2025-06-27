import { Språk } from "./i18n";

const norskDatoformaterer = new Intl.DateTimeFormat(Språk.NorwegianBokmål, {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/**
 * @param dato
 * @returns dato som tekststreng på format `YYYY-MM-DD`
 */
export const tilÅrMånedDag = (dato: Date): string => {
  const [{ value: dag }, , { value: måned }, , { value: år }] =
    norskDatoformaterer.formatToParts(dato);

  return `${år}-${måned}-${dag}`;
};

/**
 * @param dato som tekststreng
 * @returns `true` hvis `dato` er på formatet `YYYY-MM-DD`, ellers `false`
 */
export const erDatostrengÅrMånedDag = (dato: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dato);
};
