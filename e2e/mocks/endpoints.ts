import type { Page } from "@playwright/test";
import {
  generateBidragsutregning,
  generateManuellBidragsutregning,
  generatePersoninformasjon,
} from "./data";
import type { MockConfig } from "./types";

/**
 * Set up all API endpoint mocks
 */
export async function mockApiEndpoints(page: Page, config?: MockConfig) {
  // Mock person information endpoint
  await page.route("**/api/v1/person/informasjon", async (route) => {
    const delay = config?.delays?.personinformasjon;
    if (delay) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (config?.errors?.personinformasjon) {
      await route.fulfill({
        status: config.errors.personinformasjon.status,
        contentType: "application/json",
        body: JSON.stringify({
          message: config.errors.personinformasjon.message || "Mock error",
        }),
      });
      return;
    }

    const mockData = generatePersoninformasjon(config?.personinformasjon);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockData),
    });
  });

  // Mock bidrag calculation endpoint (authenticated)
  await page.route("**/api/v1/beregning/barnebidrag", async (route) => {
    // Only handle POST requests (calculations)
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }

    const delay = config?.delays?.bidragsutregning;
    if (delay) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (config?.errors?.bidragsutregning) {
      await route.fulfill({
        status: config.errors.bidragsutregning.status,
        contentType: "application/json",
        body: JSON.stringify({
          message:
            config.errors.bidragsutregning.message || "Mock calculation error",
        }),
      });
      return;
    }

    const mockData = generateBidragsutregning(config?.bidragsutregning);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockData),
    });
  });

  // Mock manual bidrag calculation endpoint (open/public)
  await page.route("**/api/v1/beregning/barnebidrag/åpen", async (route) => {
    // Only handle POST requests (calculations)
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }

    const delay = config?.delays?.manuellBidragsutregning;
    if (delay) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (config?.errors?.manuellBidragsutregning) {
      await route.fulfill({
        status: config.errors.manuellBidragsutregning.status,
        contentType: "application/json",
        body: JSON.stringify({
          message:
            config.errors.manuellBidragsutregning.message ||
            "Mock manual calculation error",
        }),
      });
      return;
    }

    const mockData = generateManuellBidragsutregning(
      config?.manuellBidragsutregning,
    );
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockData),
    });
  });

  // Note: For debugging, you can enable logging by setting DEBUG_MOCKS=true
  if (process.env.DEBUG_MOCKS === "true") {
    console.log("🎭 API mocking enabled with debug logging");
  }
}

/**
 * Helper to create specific mock scenarios
 */
export const mockScenarios = {
  /**
   * Mock scenario with no children
   */
  noChildren: {
    personinformasjon: {
      barnerelasjoner: [],
    },
  } as MockConfig,

  /**
   * Mock scenario with calculation errors
   */
  calculationError: {
    errors: {
      bidragsutregning: {
        status: 500,
        message: "Calculation service unavailable",
      },
      manuellBidragsutregning: {
        status: 500,
        message: "Manual calculation service unavailable",
      },
    },
  } as MockConfig,

  /**
   * Mock scenario with high income
   */
  highIncome: {
    personinformasjon: {
      inntekt: 1500000,
    },
    bidragsutregning: {
      resultater: [
        {
          ident: "11111111111",
          fulltNavn: "Test Testersen",
          fornavn: "Test",
          sum: 5000,
          bidragstype: "PLIKTIG" as const,
        },
      ],
    },
  } as MockConfig,

  /**
   * Mock scenario with slow responses
   */
  slowResponses: {
    delays: {
      personinformasjon: 2000,
      bidragsutregning: 3000,
      manuellBidragsutregning: 3000,
    },
  } as MockConfig,
};
