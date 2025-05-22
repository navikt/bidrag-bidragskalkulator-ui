type EventType =
  | "skjema validering feilet"
  | "skjema innsending feilet"
  | "skjema fullført"
  | "beregningsdetaljer utvidet"
  | "beregningsdetaljer kollapset"
  | "inntektsinformasjon utvidet";

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
 * await sporHendelse("skjema validering feilet", { feil: error.message })
 * ```
 *
 * @param event En hendelse som skal spores
 * @param data Optional data du kan sende med
 * @returns Promise<void>
 */
export async function sporHendelse(
  event: EventType,
  data: Record<string, unknown> = {},
) {
  const sporingsdata: Sporingsdata = {
    ...data,
    versjon: 1,
  };

  if (process.env.NODE_ENV === "development") {
    console.info(`[DEV] hendelse sporet: ${event}`, sporingsdata);
    return;
  }

  return window.umami
    ? window.umami.track(event, sporingsdata)
    : Promise.resolve();
}

const sporingsregister: Set<EventType> = new Set();

/**
 * Sporer en hendelse, men maks en gang per sidelast.
 */
export function sporHendelseEnGang(
  event: EventType,
  data: Record<string, unknown> = {},
) {
  if (sporingsregister.has(event)) {
    return;
  }

  sporingsregister.add(event);

  return sporHendelse(event, data);
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
