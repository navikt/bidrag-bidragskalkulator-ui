type EventType =
  | "skjema validering feilet"
  | "skjema innsending feilet"
  | "skjema fullført"
  | "samværsgrad justert";

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
  data?: Record<string, unknown>
) {
  if (process.env.NODE_ENV === "development") {
    console.info(`[DEV] hendelse sporet: ${event}`, data);
    return;
  }

  return window.umami ? window.umami.track(event, data) : Promise.resolve();
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
