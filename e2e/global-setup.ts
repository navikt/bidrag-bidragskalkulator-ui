import type { FullConfig } from "@playwright/test";
import { startMockServer } from "./mocks/server";

async function globalSetup(_config: FullConfig) {
  if (process.env.MOCK_BACKEND === "true") {
    await startMockServer(3001);
  }
}

export default globalSetup;
