import { createContext, useCallback, useContext, type ReactNode } from "react";
import { z } from "zod";
import { parseCookie } from "./cookie";

export enum Språk {
  English = "en",
  NorwegianBokmål = "nb",
  NorwegianNynorsk = "nn",
}
const SpråkSchema = z.nativeEnum(Språk);

const OversettelseContext = createContext<Språk | null>(null);
type OversettelseProviderProps = {
  children: ReactNode;
  språk: Språk;
};
/**
 * En provider som tilgjengeliggjør valgt språk for alle undersider.
 *
 * Hent inn språket fra "decorator-language"-cookien.
 */
export const OversettelseProvider = (props: OversettelseProviderProps) => {
  return (
    <OversettelseContext.Provider value={props.språk}>
      {props.children}
    </OversettelseContext.Provider>
  );
};

const useOversettelseContext = () => {
  const context = useContext(OversettelseContext);
  if (!context) {
    throw Error("Wrap appen i en OversettelseProvider");
  }
  return context;
};

type OversettelseObject = { [key in Språk]: string | ReactNode };

type OversettelseFunction = (
  ...args: (string | number)[]
) => OversettelseObject;

type Oversettelser = {
  [key: string]: OversettelseObject | OversettelseFunction | Oversettelser;
};

/**
 * Definer oversettelser for en komponent.
 *
 * Selve funksjonen gjør ingenting, men det gir typesikkerhet til tekst-objektet som blir sendt inn.
 *
 * @example
 * ```tsx
 * const tekster = definerTekster({ hei: { en: "Hello", no: "Hei" } });
 * ```
 *
 * @param tekster et objekt med oversettelser.
 * @returns et typesikkert objekt med oversettelser.
 */
export function definerTekster<T extends Oversettelser>(tekster: T) {
  return tekster;
}

/**
 * Hook for å bruke oversettelser.
 *
 * Denne hooken returnerer tre ting:
 * - `t`: En funksjon som returnerer oversettelsen av en tekst basert på det aktuelle språket.
 * - `språk`: Det aktuelle språket.
 *
 * @example
 * ```tsx
 * const tekster = definerTekster({ hei: { en: "Hello", no: "Hei" } });
 *
 * const { t } = useOversettelse();
 * return <div>{t(tekster.hei)}</div>;
 * ```
 */
export function useOversettelse() {
  const språk = useOversettelseContext();
  const t = useCallback(
    (tekst: OversettelseObject) => oversett(språk, tekst),
    [språk]
  );
  return {
    t,
    språk,
  };
}

/**
 * Oversetter en tekst til et gitt språk.
 * 
 * Skal kun brukes i meta() funksjonen eller andre steder man ikke kan bruke useOversettelse.
 *
 * @example
 * ```tsx
 * const tekst = { nb: "Hei", en: "Hello", nn: "Hallo" };
 * const oversettet = oversett(Språk.NorwegianBokmål, tekst);
 * ```
 
 */
export function oversett(språk: Språk, tekst: OversettelseObject) {
  return tekst[språk] as string;
}

/**
 * Henter språket fra "decorator-language"-cookien, som er cookien som brukes av dekoratøren.
 *
 * @param cookieHeader den rene cookie-strengen som kommer fra request.headers.get("cookie").
 * @returns språket som er valgt i cookien. Defaulter til norsk bokmål.
 */
export function hentSpråkFraCookie(cookieHeader: string | null) {
  if (!cookieHeader) {
    return Språk.NorwegianBokmål;
  }

  const cookies = parseCookie(cookieHeader);
  const språkCookie = cookies["decorator-language"];
  const result = SpråkSchema.safeParse(språkCookie);
  if (!result.success) {
    return Språk.NorwegianBokmål;
  }
  return result.data;
}
