export {
  defaultBidragsutregning,
  defaultManuellBidragsutregning,
  defaultManuellPersoninformasjon,
  defaultPersoninformasjon,
  genererBidragsutregning as generateBidragsutregning,
  genererManuellBidragsutregning as generateManuellBidragsutregning,
  genererManuellPersoninformasjon as generateManuellPersoninformasjon,
  genererPersoninformasjon as generatePersoninformasjon,
} from "./data";

export { startMockServer, stopMockServer } from "./server";

export type { MockConfig } from "./typer";
