module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ['newline', 'cypress'],
  extends: [
    'plugin:tailwindcss/recommended',
    "plugin:cypress/recommended"
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  rules: {
    'import/no-cycle': 'off',
    'no-console': process.env.MODE === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.MODE === 'production' ? 'warn' : 'off',
    "no-underscore-dangle":  ["error", { "allow": ["_axios", "_config"] }],
    camelcase: 'off',
    'global-require': 'off',
    'linebreak-style': 0,
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'func-call-spacing': 'off',
    'no-spaced-func': 'off',
    'no-unused-vars': 'off',
    'no-promise-executor-return': 'off',
    'tailwindcss/no-custom-classname': 'off',
    // 타입스크립트 interface 멀티라인시 콤마 적용
    // import 2개 이상시 줄바꿈 처리
    'newline/import-module': [
      'error',
      { minItems: 2 },
    ],
    // 객체 구조분해할당 프로퍼티 2개 이상시 줄바꿈 처리
    'newline/object-property': [
      'error',
      { minItems: 2 },
    ],

    'import/extensions': ['off'],
    // 배열,객체,가져오기,내보내기 멀티라인일시 마지막에 콤마
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
    // 배열이 2개 이상일시 시작 브라켓 줄바꿈
    'array-bracket-newline': [
      'error',
      { minItems: 2 },
    ],
    // 배열이 2개 이상일시 요소 줄바꿈
    'array-element-newline': [
      'error',
      { minItems: 2 },
    ],
    // 구조분해할당, 가져오기, 내보내기 프로퍼티 2개 이상일시 멀티라인 적용
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          multiline: true,
          minProperties: 2,
        },
        ObjectPattern: {
          multiline: true,
          minProperties: 2,
        },
        ImportDeclaration: {
          multiline: true,
          minProperties: 2,
        },
        ExportDeclaration: {
          multiline: true,
          minProperties: 2,
        },
      },
    ],
    // 객체 멀티라인 강제 적용
    'object-property-newline': [
      'error',
      { allowAllPropertiesOnSameLine: false },
    ],
  },
};
