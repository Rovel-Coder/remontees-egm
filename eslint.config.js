// eslint.config.js - ASYNC HERALD 100% CLEAN (0 warnings)
import antfu from '@antfu/eslint-config'

export default antfu({
  // PRÉSETS
  vue: true,
  typescript: true,
  formatters: true,

  // IGNORES
  ignores: [
    'dist/**',
    'node_modules/**',
    '*.config.{js,ts}',
    'coverage/**'
  ],

  // RÈGLES PERSONNALISÉES
  rules: {
    // ESPACES
    'style/space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }
    ],

    // WHITESPACE
    'no-irregular-whitespace': 'warn',
    'vue/no-irregular-whitespace': 'warn',

    // VUE
    'vue/max-attributes-per-line': [
      'error',
      { singleline: { max: 1 }, multiline: { max: 1 } }
    ],

    // TS
    'ts/ban-ts-comment': [
      'error',
      { 'ts-ignore': 'allow-with-description' }
    ],

    // STRUCTURE
    'curly': ['error', 'all'],

    // COMMENTS
    'style/spaced-comment': [
      'error',
      'always',
      { markers: ['#region', '#endregion', '/'] }
    ],

    // AUTRES
    'style/comma-dangle': 'off',

    // DISABLE STRICT
    'no-unused-vars': 'off',
    'vue/no-unused-vars': 'off',

    // CONSISTENCY
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { disallowTypeAnnotations: false }
    ]
  },

  // LANGUE
  languageOptions: {
    globals: {
      process: 'readonly',
      __dirname: 'readonly'
    }
  }
})


