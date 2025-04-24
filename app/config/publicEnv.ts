const isServer = typeof process !== "undefined";
const miljøvariabler = isServer ? process.env : import.meta.env;

/**
 * Offentlig tilgjengelige miljøvariabler.
 *
 * Disse er tilgjengelige på klientsiden, og skal ikke inneholde sensitiv informasjon.
 */
export const publicEnv = {
  UMAMI_WEBSITE_ID: miljøvariabler.UMAMI_WEBSITE_ID,
  ENVIRONMENT: miljøvariabler.ENVIRONMENT,
};
