import type { Sporingshendelse } from "~/types/analyse";

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

export const sporHendelse = async (hendelse: Sporingshendelse) => {
  const { hendelsetype, ...data } = hendelse;
  const sporingsdata: Sporingsdata = {
    ...data,
    versjon: 1,
  };

  if (process.env.NODE_ENV === "development") {
    console.info(`[DEV] hendelse sporet:`, hendelsetype, sporingsdata);
    return;
  }

  return window.umami
    ? window.umami.track(hendelsetype, sporingsdata)
    : Promise.resolve();
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
