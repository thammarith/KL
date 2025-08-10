import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	globalIgnores(['lib/**/*', 'generated/**/*']),
	{
		files: ['**/*.{js,mjs,cjs}'],
		languageOptions: {
			globals: {
				...globals.node,
				...globals.es6,
			},
			sourceType: 'module',
		},
		plugins: {
			import: importPlugin,
		},
		rules: {
			...js.configs.recommended.rules,
			...importPlugin.configs.errors.rules,
			...importPlugin.configs.warnings.rules,
			'import/no-unresolved': 0,
		},
	},
	{
		files: ['**/*.{ts,mts,cts}'],
		languageOptions: {
			globals: {
				...globals.node,
				...globals.es6,
			},
			parser: tseslint.parser,
			parserOptions: {
				project: ['tsconfig.json'],
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
			import: importPlugin,
		},
		rules: {
			...js.configs.recommended.rules,
			...tseslint.configs.recommended.rules,
			...importPlugin.configs.errors.rules,
			...importPlugin.configs.warnings.rules,
			...importPlugin.configs.typescript.rules,
			'import/no-unresolved': 0,
		},
	},
]);
