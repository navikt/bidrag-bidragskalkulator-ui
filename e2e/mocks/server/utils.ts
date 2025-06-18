import type { IncomingMessage, ServerResponse } from "http";

/**
 * Setter CORS-headers for å tillate requests fra alle origin
 */
export function settCorsHeadere(res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

/**
 * Sender JSON-respons med gitt statuskode og data
 */
export function sendJsonRespons(
  res: ServerResponse,
  statusCode: number,
  data: unknown,
) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

/**
 * Behandler POST-request med JSON-body
 * Validerer JSON-format og kaller handler-funksjon
 */
export function handlePostRequest(
  req: IncomingMessage,
  res: ServerResponse,
  handler: (body: string) => void,
) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      JSON.parse(body);
      handler(body);
    } catch {
      sendJsonRespons(res, 400, { error: "Invalid JSON" });
    }
  });
}
