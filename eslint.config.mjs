import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    globalIgnores(['**/node_modules/', '**/dist/', '**/build/', '**/public/', '**/*.html']),
    {
        extends: compat.extends('eslint:recommended'),

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.commonjs,
            },

            ecmaVersion: 'latest',
            sourceType: 'module',
        },

        rules: {
            indent: 'off',
            'linebreak-style': 'off',
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            'no-unused-vars': ['warn'],
            'no-console': 'off',
            'no-var': 'error',
            'prefer-const': 'error',
            eqeqeq: ['error', 'always'],
            'no-path-concat': 'error',
            'handle-callback-err': 'error',
        },
    },
]);