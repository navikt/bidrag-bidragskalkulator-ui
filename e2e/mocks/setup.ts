import type { Page } from "@playwright/test";
import { mockApiEndpoints } from "./endpoints";
import type { MockConfig } from "./types";

/**
 * Setter opp API-mocking for backenden, om mocking er aktivert
 *
 * @param page - Playwright Page-objektet som skal brukes
 * @param config - Valgfri konfigurasjon for å overstyre standard mock-responser
 */
export async function setupMocks(page: Page, config?: MockConfig) {
  if (!isMockingEnabled()) {
    return;
  }

  console.log("🎭 Setter opp API mocks...");

  await mockApiEndpoints(page, config);

  console.log("✅ API mocks konfigurert");
}

/**
 * Convenience function to check if mocking is enabled
 */
export function isMockingEnabled(): boolean {
  return process.env.MOCK_BACKEND === "true";
}
