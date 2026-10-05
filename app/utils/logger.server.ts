import { logger } from "@navikt/pino-logger";
import { teamLogger } from "@navikt/pino-logger/team-log";

export const serverLogger = {
  info(melding: string) {
    logger.info(melding);
    teamLogger.info(melding);
  },
  error(melding: string, status?: number) {
    const detaljer = status === undefined ? {} : { status };
    logger.error(detaljer, melding);
    teamLogger.error(detaljer, melding);
  },
};
