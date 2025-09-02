import type { IncomingMessage, ServerResponse } from "http";
import {
  genererBidragsutregning,
  genererKalkulatorGrunnlagsdata,
} from "../data";
import { handlePostRequest, sendJsonRespons } from "./utils";

/**
 * Handler for personinformasjons-endepunkt
 * GET /api/v1/person/informasjon
 */
export function handleKalkulatorGrunnlagsdata(
  _: IncomingMessage,
  res: ServerResponse,
) {
  const mockData = genererKalkulatorGrunnlagsdata();
  sendJsonRespons(res, 200, mockData);
}

/**
 * Handler for åpen bidragsberegning
 * POST /api/v1/beregning/barnebidrag/åpen
 */
export function handleÅpenBidragsberegning(
  req: IncomingMessage,
  res: ServerResponse,
) {
  handlePostRequest(req, res, () => {
    const mockData = genererBidragsutregning();
    sendJsonRespons(res, 200, mockData);
  });
}
