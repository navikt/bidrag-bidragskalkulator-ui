# API Mocking for Playwright Tests

This directory contains a comprehensive API mocking system for the Bidragskalkulator application. The mocking system uses Playwright's built-in route interception to mock all external API calls when the `MOCK_BACKEND` environment variable is set to `true`.

## Features

- ✅ **Automatic activation** - Mocking is enabled only when `MOCK_BACKEND=true`
- ✅ **Complete API coverage** - Mocks all external endpoints used by the application
- ✅ **Configurable responses** - Easy to customize mock data for different test scenarios
- ✅ **Error simulation** - Built-in support for testing error conditions
- ✅ **Response delays** - Simulate slow network conditions
- ✅ **Pre-defined scenarios** - Common test scenarios ready to use
- ✅ **TypeScript support** - Full type safety for mock configurations

## Quick Start

### Basic Usage

```typescript
import { setupMocks } from "./mocks";

test("my test", async ({ page }) => {
  // Enable mocking with default responses
  await setupMocks(page);

  await page.goto("/");
  // Your test logic here
});
```

### Custom Mock Data

```typescript
import { setupMocks } from "./mocks";

test("high income scenario", async ({ page }) => {
  await setupMocks(page, {
    personinformasjon: {
      inntekt: 1500000, // Override income
    },
    bidragsutregning: {
      resultater: [
        {
          ident: "12345678901",
          fulltNavn: "Test Person",
          fornavn: "Test",
          sum: 5000, // Higher amount due to high income
          bidragstype: "PLIKTIG",
        },
      ],
    },
  });

  await page.goto("/");
  // Test with high income data
});
```

### Pre-defined Scenarios

```typescript
import { setupMocks, mockScenarios } from "./mocks";

test("no children scenario", async ({ page }) => {
  await setupMocks(page, mockScenarios.noChildren);
  await page.goto("/med-barn");
  // Test behavior when user has no children
});

test("calculation error", async ({ page }) => {
  await setupMocks(page, mockScenarios.calculationError);
  await page.goto("/");
  // Test error handling
});
```

## Environment Variables

| Variable       | Description                    | Default |
| -------------- | ------------------------------ | ------- |
| `MOCK_BACKEND` | Enable/disable API mocking     | `false` |
| `DEBUG_MOCKS`  | Enable debug logging for mocks | `false` |

### Running Tests with Mocking

```bash
# Enable mocking for all tests
MOCK_BACKEND=true npm run test:e2e

# Enable mocking with debug output
MOCK_BACKEND=true DEBUG_MOCKS=true npm run test:e2e

# Run specific test with mocking
MOCK_BACKEND=true npx playwright test beregning.spec.ts
```

## API Endpoints Mocked

### Person Information

- **Endpoint**: `/api/v1/person/informasjon`
- **Method**: GET
- **Purpose**: Fetch user and children information for authenticated users

### Bidrag Calculation (Authenticated)

- **Endpoint**: `/api/v1/beregning/barnebidrag`
- **Method**: POST
- **Purpose**: Calculate child support for authenticated users with real data

### Manual Bidrag Calculation (Public)

- **Endpoint**: `/api/v1/beregning/barnebidrag/åpen`
- **Method**: POST
- **Purpose**: Calculate child support for anonymous users with manual input

## Mock Configuration Options

### MockConfig Interface

```typescript
interface MockConfig {
  // Override default responses
  personinformasjon?: Partial<Personinformasjon>;
  manuellPersoninformasjon?: Partial<ManuellPersoninformasjon>;
  bidragsutregning?: Partial<Bidragsutregning>;
  manuellBidragsutregning?: Partial<ManuellBidragsutregning>;

  // Simulate errors
  errors?: {
    personinformasjon?: { status: number; message?: string };
    bidragsutregning?: { status: number; message?: string };
    // ... other endpoints
  };

  // Add response delays
  delays?: {
    personinformasjon?: number; // milliseconds
    bidragsutregning?: number;
    // ... other endpoints
  };
}
```

## Pre-defined Mock Scenarios

### `mockScenarios.noChildren`

Simulates a user with no children.

### `mockScenarios.calculationError`

Simulates calculation service errors (500 status).

### `mockScenarios.highIncome`

Simulates a high-income user with correspondingly higher child support amounts.

### `mockScenarios.slowResponses`

Adds delays to all API responses to test loading states.

## Custom Mock Data Generators

```typescript
import { generatePersoninformasjon, generateBidragsutregning } from "./mocks";

// Generate custom person info
const customPersonInfo = generatePersoninformasjon({
  inntekt: 750000,
  barnerelasjoner: [
    {
      motpart: { ident: "98765432109" },
      fellesBarn: [
        {
          ident: "11111111111",
          fornavn: "Emma",
          fulltNavn: "Emma Johnson",
          alder: 6,
          underholdskostnad: 4000,
        },
      ],
    },
  ],
});

// Generate custom calculation result
const customCalculation = generateBidragsutregning({
  resultater: [
    {
      ident: "11111111111",
      fulltNavn: "Emma Johnson",
      fornavn: "Emma",
      sum: 3200,
      bidragstype: "PLIKTIG",
    },
  ],
});
```

## Default Mock Data

The system provides realistic default mock data:

- **Person**: Norwegian test identity numbers
- **Income**: 500,000 NOK annually
- **Children**: 2 children (ages 8 and 12)
- **Child Support**: Calculated amounts around 2,500-3,000 NOK per child

## Advanced Usage

### Conditional Mocking

```typescript
import { isMockingEnabled, setupMocks } from "./mocks";

test("my test", async ({ page }) => {
  if (isMockingEnabled()) {
    await setupMocks(page);
    // Mock-specific test logic
  } else {
    // Real backend test logic
  }

  await page.goto("/");
});
```

### Per-Test Mock Configuration

```typescript
test.describe("Calculation Tests", () => {
  test("standard calculation", async ({ page }) => {
    await setupMocks(page); // Default data
    // Test logic
  });

  test("high income calculation", async ({ page }) => {
    await setupMocks(page, {
      personinformasjon: { inntekt: 1500000 },
    });
    // Test logic
  });

  test("error handling", async ({ page }) => {
    await setupMocks(page, {
      errors: { bidragsutregning: { status: 500 } },
    });
    // Test logic
  });
});
```

## Troubleshooting

### Mocks Not Working

1. Ensure `MOCK_BACKEND=true` is set
2. Check that `setupMocks(page)` is called before navigating
3. Enable debug logging with `DEBUG_MOCKS=true`

### Test Failures with Mocks

1. Verify mock data matches expected format
2. Check that UI elements match mocked data
3. Ensure error scenarios are properly handled

### Performance Issues

1. Avoid unnecessary delays in mock configuration
2. Use `mockScenarios.slowResponses` only when testing loading states
3. Consider running tests without mocks for performance comparison

## File Structure

```
e2e/mocks/
├── index.ts           # Main exports
├── setup.ts           # Mock initialization
├── endpoints.ts       # API endpoint handlers
├── data.ts           # Default mock data and generators
├── types.ts          # TypeScript interfaces
└── README.md         # This file
```

## Contributing

When adding new API endpoints to the application:

1. Add the endpoint handler in `endpoints.ts`
2. Define response types in `types.ts`
3. Create default mock data in `data.ts`
4. Update this README with endpoint documentation
5. Add test examples demonstrating the new endpoint
