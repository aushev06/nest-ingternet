const typescriptEslintPrettier = require("eslint-config-prettier/@typescript-eslint");

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 12,
  },
  plugins: [
    "@typescript-eslint",
    "jest",
    "simple-import-sort"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:jest/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    ...typescriptEslintPrettier.rules,
    curly: [2, "all"],
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "ignore",
      },
    ],
    "no-useless-return": 2,
    "import/order": "off",
    "sort-imports": "off",
    "no-void": 0,
    "no-console": 0,
    "eqeqeq": ["error", "always"],
    "simple-import-sort/sort": "error",
    "prettier/prettier": "error",
    "no-plusplus": 0,
    "@typescript-eslint/explicit-function-return-type": 2,
    "@typescript-eslint/no-explicit-any": 2,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": 1,
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_\d?" }], 
    "import/prefer-default-export": 0,
    "no-undef-init": 1,
    'jest/expect-expect': [
      'warn',
      {
        assertFunctionNames: [
          'expect',
          'request.*.expect',
          'request.*.expect*',
          'request.**.expect',
        ],
      },
    ],
    "max-len": [
      "warn",
      120,
      2,
      {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: false,
        ignoreTemplateLiterals: true,
      },
    ],
  },
};
