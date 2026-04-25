/**
 * Jest configuration for quartz-ui core.
 *
 * Uses `jest-expo` so we get the RN module map + Expo mocks for free.
 * Reanimated and other native modules are mocked in jest.setup.js.
 */

/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.setup.js'],
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  // Stub the Expo "winter" runtime — it lazy-installs a global property whose
  // getter calls require() during teardown, which Jest 30 rejects with
  // "outside the scope of the test code".
  moduleNameMapper: {
    '^expo/src/winter/runtime\\.native$': '<rootDir>/jest.stub.js',
    '^expo/src/winter/runtime$': '<rootDir>/jest.stub.js',
    '^expo/src/winter$': '<rootDir>/jest.stub.js',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 60,
      lines: 70,
      statements: 70,
    },
  },
  clearMocks: true,
};
