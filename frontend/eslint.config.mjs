import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import-x';
import vueParser from 'vue-eslint-parser';
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      vue: pluginVue,
      '@stylistic': stylistic,
      import: importPlugin,
    },
    extends: [
      js.configs.recommended,
      ...pluginVue.configs['flat/essential'],
    ],
    rules: {
      // Основные правила
      'eol-last': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      semi: ['error', 'always'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-alert': 'off',
      'no-shadow': ['error', { allow: ['state'] }],
      'no-unused-vars': 'error',
      'no-param-reassign': ['warn', {
        props: true,
        ignorePropertyModificationsFor: ['acc', 'accumulator', 'e'],
        ignorePropertyModificationsForRegex: ['Acc$', 'Var$'],
      }],

      // Стилистика
      '@stylistic/indent': ['warn', 4, {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        FunctionDeclaration: { parameters: 1, body: 1 },
        FunctionExpression: { parameters: 1, body: 1 },
        CallExpression: { arguments: 1 },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
      }],
      '@stylistic/quotes': ['warn', 'single', { avoidEscape: false }],
      '@stylistic/max-len': ['warn', { code: 120 }],
      '@stylistic/object-curly-spacing': ['warn', 'always'],

      // Импорты
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
      'import/no-useless-path-segments': ['error', { noUselessIndex: false }],
      'import/order': 'off',
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: true,
        optionalDependencies: false,
      }],
      'import/prefer-default-export': 'off',

      // Vue
      'vue/html-indent': ['warn', 4, {
        attribute: 1,
        alignAttributesVertically: true,
      }],
      'vue/html-quotes': ['error', 'double', { avoidEscape: false }],
      'vue/component-name-in-template-casing': ['error', 'PascalCase', {
        registeredComponentsOnly: false,
      }],
      'vue/no-v-html': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',

      // Vue 3 deprecations
      'vue/no-deprecated-v-on-native-modifier': 'error',
      'vue/no-deprecated-v-bind-sync': 'error',
      'vue/no-deprecated-v-is': 'error',
      'vue/no-deprecated-dollar-listeners-api': 'error',
      'vue/no-deprecated-dollar-scopedslots-api': 'error',
    },
  },

  // Markdown
  { files: ['**/*.md'], plugins: { markdown }, language: 'markdown/commonmark', extends: ['markdown/recommended'] },

  // CSS
  { files: ['**/*.css'], plugins: { css }, language: 'css/css', extends: ['css/recommended'] },
]);
