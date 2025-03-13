import { getAmplitudeInstance } from "@navikt/nav-dekoratoren-moduler";

const logger = getAmplitudeInstance("barnebidragskalkulator");

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
export function sporHendelse(event: EventType, data?: Record<string, unknown>) {
  if (process.env.NODE_ENV === "development") {
    console.info(`[DEV] hendelse sporet: ${event}`, data);
  }
  return logger(event, data);
}
