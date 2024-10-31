module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
    webextensions: true,
  },
  globals: {
    INPAGE_SCRIPT: 'readonly',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:import/recommended',
    'plugin:json/recommended',
    'plugin:tailwindcss/recommended',
    'prettier',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    tsconfigBaseDir: __dirname,
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.vue', '.json'],
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/component-tags-order': [
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    'vue/no-deprecated-slot-attribute': 'off', // to allow lit slot usage in vue
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-debugger': 2,
    'no-unused-vars': 'off', // Using the ts rule above instead.
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external', 'index'],
          ['sibling', 'parent', 'internal'],
          'object',
          'type',
        ],
        'newlines-between': 'always',
      },
    ],
    'tailwindcss/no-custom-classname': [
      'error',
      {
        whitelist: [
          'paragraph-.*',
          'heading-.*',
          'nav-.*',
          'shadow-.*',
          'instagram-.*',
          'twitter-.*',
          'grid-.*',
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.spec.ts'],
      extends: ['plugin:playwright/playwright-test'],
      rules: {
        'playwright/no-standalone-expect': 'off',
        'playwright/no-networkidle': 'off',
        'playwright/no-skipped-test': 'off',
        'playwright/no-conditional-expect': 'off',
      },
    },
    {
      files: ['**/dist/**/*.js', '**/.output/**/*.js'],
      rules: {
        complexity: 0,
      },
    },
    {
      files: ['./*.js', './*.cjs'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2020,
      },
    },
  ],
}
