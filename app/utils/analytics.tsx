import { getAnalyticsInstance } from "@navikt/nav-dekoratoren-moduler";
import {
  skjemanavnMapping,
  type Seksjon,
  type SkjemaId,
  type SkjemaseksjonFullført,
  type Sporingshendelse,
} from "~/types/analyse";

type Sporingsdata = Record<string, unknown> & {
  /**
   * Versjon av sporingsdata. Hvis vi endrer strukturen på data for ett eller flere
   * events må denne oppdateres, og spørringer i dashboards tilpasses.
   */
  versjon: 1;
};

/**
 * Sporer en hendelse
 *
 * Under utvikling logges det til console istedenfor.
 *
 * ```tsx
 * await sporHendelse({
 *   hendelsetype: "skjema validering feilet",
 *   førsteFeil: error.message
 * })
 * ```
 *
 * @param hendelse En hendelse som skal spores
 * @returns Promise<void>
 */

export const sporHendelse = (hendelse: Sporingshendelse) => {
  const { hendelsetype, ...data } = hendelse;
  const sporingsdata: Sporingsdata = {
    ...data,
    versjon: 1,
  };

  if (erSkjemahendelse(hendelse)) {
    sporingsdata.skjemanavn = skjemanavnMapping[hendelse.skjemaId];
  }

  // if (process.env.NODE_ENV === "development") {
  //   console.info(`[DEV] hendelse sporet:`, hendelsetype, sporingsdata);
  //   return;
  // }

  // console.log("🚀 ~ sporHendelse ~ hendelsetype:", hendelsetype);
  // console.log("🚀 ~ sporHendelse ~ data:", data);
  const logger = getAnalyticsInstance("barnebidragskalkulator");
  logger(hendelsetype, data);
};

const erSkjemahendelse = (
  hendelse: Sporingshendelse,
): hendelse is Sporingshendelse & { skjemaId: SkjemaId } => {
  return "skjemaId" in hendelse && hendelse.skjemaId !== undefined;
};

const sporingsregister: Set<Sporingshendelse["hendelsetype"]> = new Set();

/**
 * Sporer en hendelse, men maks en gang per sidelast.
 */
export function sporHendelseEnGang(event: Sporingshendelse) {
  if (sporingsregister.has(event.hendelsetype)) {
    return;
  }

  sporingsregister.add(event.hendelsetype);

  return sporHendelse(event);
}

const skjemaseksjonFullførtRegister: Set<Seksjon> = new Set();

/**
 * Sporer skjemaseksjon fullført, men maks en gang per seksjon per sidelast.
 */
export function sporSkjemaseksjonFullførtEnGang(event: SkjemaseksjonFullført) {
  if (skjemaseksjonFullførtRegister.has(event.seksjon)) {
    return;
  }

  skjemaseksjonFullførtRegister.add(event.seksjon);

  return sporHendelse(event);
}

type AnalyticsProps = {
  umamiWebsiteId: string;
};

/**
 * Setter inn analytics-script (om umamiWebsiteId er satt)
 */
export function Analytics({ umamiWebsiteId }: AnalyticsProps) {
  if (!umamiWebsiteId) {
    return null;
  }

  return (
    <script
      defer
      src="https://cdn.nav.no/team-researchops/sporing/sporing.js"
      data-host-url="https://umami.nav.no"
      data-website-id={umamiWebsiteId}
    />
  );
}
