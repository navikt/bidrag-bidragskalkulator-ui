import type { FullConfig } from "@playwright/test";
import { stopMockServer } from "./mocks/server";

async function globalTeardown(_config: FullConfig) {
  if (process.env.MOCK_BACKEND === "true") {
    await stopMockServer();
  }
}

export default globalTeardown;
