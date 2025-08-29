import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      },
      globals: {
        Buffer: true,
        console: true,
        process: true,
        URL: true,
        // Node.js globals
        setTimeout: true,
        clearTimeout: true,
        setInterval: true,
        clearInterval: true,
        global: true,
        __dirname: true,
        __filename: true
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': ['warn', {
        ignoreRestArgs: true,
        fixToUnknown: false
      }],
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'no-console': ['warn', {
        allow: ['error', 'warn', 'info', 'debug']
      }],
      'no-case-declarations': 'off',
      'no-unused-vars': 'off' // Using @typescript-eslint/no-unused-vars instead
    }
  },
  // Test files configuration
  {
    files: ['src/test/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      },
      globals: {
        Buffer: true,
        console: true,
        process: true,
        URL: true,
        // Node.js globals
        setTimeout: true,
        clearTimeout: true,
        setInterval: true,
        clearInterval: true,
        global: true,
        __dirname: true,
        __filename: true,
        // Jest globals
        describe: true,
        it: true,
        test: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
        beforeAll: true,
        afterAll: true,
        jest: true
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': ['warn', {
        ignoreRestArgs: true,
        fixToUnknown: false
      }],
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'no-console': 'off', // Allow console in tests
      'no-case-declarations': 'off',
      'no-unused-vars': 'off' // Using @typescript-eslint/no-unused-vars instead
    }
  }
]; 