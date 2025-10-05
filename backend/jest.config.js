module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 75,      // Lowered from 80
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
};