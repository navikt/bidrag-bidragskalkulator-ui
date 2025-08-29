import type { IncomingMessage, ServerResponse } from "http";
import { createServer } from "http";
import { parse } from "url";
import {
  handleKalkulatorGrunnlagsdata,
  handleÅpenBidragsberegning,
} from "./handlers";
import { sendJsonRespons, settCorsHeadere } from "./utils";

let mockServer: ReturnType<typeof createServer> | null = null;

type Route = {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  handler: (req: IncomingMessage, res: ServerResponse) => void;
  name: string;
};
const routes: Route[] = [
  {
    path: "/api/v1/person/grunnlagsdata",
    method: "GET",
    handler: handleKalkulatorGrunnlagsdata,
    name: "Personinformasjon",
  },
  {
    path: "/api/v1/beregning/barnebidrag/åpen",
    method: "POST",
    handler: handleÅpenBidragsberegning,
    name: "Åpen bidragsberegning",
  },
  {
    path: "/api/v1/beregning/barnebidrag/%C3%A5pen",
    method: "POST",
    handler: handleÅpenBidragsberegning,
    name: "Åpen bidragsberegning (URL-enkodet)",
  },
];

/**
 * Route-handler som behandler alle innkommende requests
 */
function handleRequest(req: IncomingMessage, res: ServerResponse) {
  const { pathname } = parse(req.url || "", true);

  settCorsHeadere(res);

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  console.log(`🎭 Mock server fanget opp: ${req.method} ${pathname}`);

  const route = routes.find(
    (r) => r.path === pathname && r.method === req.method,
  );

  if (route) {
    return route.handler(req, res);
  }

  console.log(`❌ Ingen mock funnet for: ${req.method} ${pathname}`);
  console.log(
    `💡 Mockete routes:`,
    routes.map((r) => `${r.method} ${r.path}`),
  );
  sendJsonRespons(res, 404, { error: "Not found" });
}

/**
 * Starter mock-serveren på gitt port
 */
export async function startMockServer(port = 3001) {
  if (mockServer) {
    return port;
  }

  mockServer = createServer(handleRequest);

  return new Promise<number>((resolve, reject) => {
    mockServer?.listen(port, (err?: Error) => {
      if (err) {
        reject(err);
      } else {
        console.log(`🎭 Mock server startet på port ${port}`);
        resolve(port);
      }
    });
  });
}

/**
 * Stopper mock-serveren
 */
export async function stopMockServer() {
  if (mockServer) {
    return new Promise<void>((resolve) => {
      mockServer?.close(() => {
        console.log("🎭 Mock server stoppet");
        mockServer = null;
        resolve();
      });
    });
  }
}
