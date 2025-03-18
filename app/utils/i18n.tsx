import { createContext, useContext, type ReactNode } from "react";
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
  return {
    t: (tekst: OversettelseObject) => tekst[språk] as string,
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
