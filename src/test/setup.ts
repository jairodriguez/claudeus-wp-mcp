import { jest } from '@jest/globals';

// Extend timeout for async operations
jest.setTimeout(10000);

// Add custom matchers if needed
expect.extend({
  toBeValidJsonRpc(received) {
    const pass = received &&
      typeof received === 'object' &&
      received.jsonrpc === '2.0' &&
      (typeof received.id === 'number' || typeof received.id === 'string' || received.id === undefined) &&
      (typeof received.method === 'string' || received.method === undefined) &&
      (typeof received.params === 'object' || received.params === undefined) &&
      (typeof received.result === 'object' || received.result === undefined) &&
      (typeof received.error === 'object' || received.error === undefined);

    return {
      message: () =>
        `expected ${JSON.stringify(received)} to be a valid JSON-RPC message`,
      pass,
    };
  },
}); 