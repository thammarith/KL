import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import googleConfig from 'eslint-config-google';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	globalIgnores(['lib/**/*', 'generated/**/*']),
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		plugins: {
			js,
			'@typescript-eslint': tseslint.plugin,
			import: importPlugin,
		},
		extends: [
			'js/recommended',
			googleConfig,
		],
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		languageOptions: {
			globals: { ...globals.node, ...globals.es6 },
			parser: tseslint.parser,
			parserOptions: {
				project: ['tsconfig.json', 'tsconfig.dev.json'],
				sourceType: 'module',
			},
		},
	},
	...tseslint.configs.recommended,
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		rules: {
			quotes: ['error', 'double'],
			'import/no-unresolved': 0,
			indent: ['error', 2],
		},
	},
]);
