import type { IncomingMessage, ServerResponse } from "http";
import {
  generatePersoninformasjon,
  generateBidragsutregning as generererBidragsutregning,
  generateManuellBidragsutregning as generererManuellBidragsutregning,
} from "../data";
import { handlePostRequest, sendJsonRespons } from "./utils";

/**
 * Handler for personinformasjons-endepunkt
 * GET /api/v1/person/informasjon
 */
export function handlePersonInformasjon(
  _: IncomingMessage,
  res: ServerResponse,
) {
  const mockData = generatePersoninformasjon();
  sendJsonRespons(res, 200, mockData);
}

/**
 * Handler for autentisert bidragsberegning
 * POST /api/v1/beregning/barnebidrag
 */
export function handleBidragsberegning(
  req: IncomingMessage,
  res: ServerResponse,
) {
  handlePostRequest(req, res, () => {
    const mockData = generererBidragsutregning();
    sendJsonRespons(res, 200, mockData);
  });
}

/**
 * Handler for åpen (manuell) bidragsberegning
 * POST /api/v1/beregning/barnebidrag/åpen
 */
export function handleÅpenBidragsberegning(
  req: IncomingMessage,
  res: ServerResponse,
) {
  handlePostRequest(req, res, () => {
    const mockData = generererManuellBidragsutregning();
    sendJsonRespons(res, 200, mockData);
  });
}
