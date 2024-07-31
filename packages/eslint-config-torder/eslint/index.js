module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true,
  },
  plugins: ['import'],
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-airbnb',
    '@vue/eslint-config-typescript',
    'plugin:import/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    /**
     * import 가 해결 가능한 파일/모듈을 가르키는지 검사
     * https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-unresolved.md#options
     */
    'import/no-unresolved': 'off',
    /**
     * 양방향에서 서로 import 하는지 검사
     * https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md
     */
    'import/no-cycle': 'off',
    /**
     * import 순서 설정
     * https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
     */
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        alphabetize: { order: 'desc' },
      },
    ],
    /**
     * dependencies, devDependencies 에서 선언되지 않은 외부 모듈의 가져오기 금지 검사
     * https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-extraneous-dependencies.md
     */
    'import/no-extraneous-dependencies': 'off',
    /**
     * console 사용시 경고
     * https://eslint.org/docs/latest/rules/no-console#rule-details
     */
    'no-console': ['warn', { allow: ['error'] }],
    /**
     * debugger 사용시 경고
     * https://eslint.org/docs/latest/rules/no-debugger#rule-details
     */
    'no-debugger': 'warn',
    /**
     * 함수 매개변수 재할당 검사
     * https://eslint.org/docs/latest/rules/no-param-reassign#rule-details
     */
    'no-param-reassign': ['error', { props: false }],
    /**
     * 불안전한 옵셔널체이닝 사용 검사
     * https://eslint.org/docs/latest/rules/no-unsafe-optional-chaining#rule-details
     */
    'no-unsafe-optional-chaining': 'off',
    /**
     * 사용되지 않는 변수 검사 (typescript lint 와 중복되어 off 처리)
     * https://eslint.org/docs/latest/rules/no-unused-vars#rule-details
     */
    'no-unused-vars': 'off',
    /**
     * 카멜 케이스 사용 여부 검사
     * https://eslint.org/docs/latest/rules/camelcase#rule-details
     */
    camelcase: 'off',
    /**
     * 들여쓰기 설정 (prettier 사용으로 off 처리)
     * https://eslint.org/docs/latest/rules/indent#rule-details
     */
    indent: 'off',
    /**
     * 함수 간격 space 검사 (prettier 충돌로 off 처리)
     * https://eslint.org/docs/latest/rules/func-call-spacing
     */
    'func-call-spacing': 'off',
    /**
     * 연산자 줄바꿈 관련 검사 (prettier 충돌로 off 처리)
     * https://eslint.org/docs/latest/rules/operator-linebreak#rule-details
     */
    'operator-linebreak': 'off',
    /**
     * 함수 인자 줄바꿈 관련 검사 (prettier 충돌로 off 처리)
     * https://eslint.org/docs/latest/rules/function-paren-newline#rule-details
     */
    'function-paren-newline': 'off',
    /**
     * @deprecated
     * 화살표 함수 혼동해서 사용 관련 검사 (ESLint v8.53.0 Deprecated)
     * https://eslint.org/docs/latest/rules/no-confusing-arrow#rule-details
     */
    'no-confusing-arrow': 'off',
    /**
     * @deprecated
     * 함수 괄호 공백 검사 (ESLint Deprecated)
     * https://eslint.org/docs/latest/rules/no-spaced-func
     */
    'no-spaced-func': 'off',
    /**
     * @deprecated
     * 객체 줄바꿈 검사 (ESLint v8.53.0 Deprecated)
     * https://eslint.org/docs/latest/rules/object-curly-newline
     */
    'object-curly-newline': 'off',
    /**
     * 화살표 함수의 줄바꿈 스타일 검사
     * https://eslint.org/docs/latest/rules/implicit-arrow-linebreak#rule-details
     */
    'implicit-arrow-linebreak': 'off',
    /**
     * 사용되지 않는 변수 검사
     * https://typescript-eslint.io/rules/no-unused-vars/
     */
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    /**
     * 버튼 타입 필수 입력 검사
     * https://eslint.vuejs.org/rules/html-button-has-type.html#vue-html-button-has-type
     */
    'vue/html-button-has-type': 'off',
    /**
     * vue 템플릿 태그 안에 태그 어트리부트 순서 설정
     * https://eslint.vuejs.org/rules/attributes-order.html#vue-attributes-order
     */
    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          ['UNIQUE', 'SLOT'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT',
        ],
        alphabetical: false,
      },
    ],
    /**
     * vue 템플릿 태그 안에 탭 길이 설정
     * https://eslint.vuejs.org/rules/html-indent.html#vue-html-indent
     */
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: [],
      },
    ],
    /**
     * vue html 태그 어트리부트 존재시 줄바꿈 (prettier 설정과 충돌되어 off)
     * https://eslint.vuejs.org/rules/singleline-html-element-content-newline.html#vue-singleline-html-element-content-newline
     */
    'vue/singleline-html-element-content-newline': 'off',
    /**
     * vue html 태그 여러개의 어트리부트 존재시 줄바꿈
     * https://eslint.vuejs.org/rules/multiline-html-element-content-newline.html#vue-multiline-html-element-content-newline
     */
    'vue/multiline-html-element-content-newline': [
      'error',
      {
        ignoreWhenEmpty: true,
        allowEmptyLines: false,
      },
    ],
    /**
     * vue html 태그 멀티라인시 종료 브라켓 줄바꿈
     * https://eslint.vuejs.org/rules/html-closing-bracket-newline.html#vue-html-closing-bracket-newline
     */
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'always',
      },
    ],
    /**
     * vue html 태그 스페이스 제거
     * https://eslint.vuejs.org/rules/no-spaces-around-equal-signs-in-attribute.html#vue-no-spaces-around-equal-signs-in-attribute
     */
    'vue/no-spaces-around-equal-signs-in-attribute': ['error'],
    /**
     * html 태그 닫힘 태그 검사
     * https://eslint.vuejs.org/rules/html-self-closing.html#vue-html-self-closing
     */
    'vue/html-self-closing': [
      'error',
      {
        html: {
          normal: 'never',
          void: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    /**
     * vue 구조 순서 검사 (script - template - style)
     * https://eslint.vuejs.org/rules/component-tags-order.html#vue-component-tags-order
     */
    'vue/component-tags-order': [
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    /**
     * vue component name 2개 이상 단어 사용 검사 (ex - todoItem)
     * https://eslint.vuejs.org/rules/multi-word-component-names.html#vue-multi-word-component-names
     */
    'vue/multi-word-component-names': 'off',
    /**
     * vue component properties 캐밥 케이스 검사 (ex - my-props)
     * https://eslint.vuejs.org/rules/attribute-hyphenation.html#vue-attribute-hyphenation
     */
    'vue/attribute-hyphenation': 'off',
    /**
     * v-bind:foo 비허용 / :foo 허용 검사
     * https://eslint.vuejs.org/rules/v-bind-style.html#vue-v-bind-style
     */
    'vue/v-bind-style': ['error', 'shorthand'],
    /**
     * v-on:foo 비허용 / @foo 허용 검사
     * https://eslint.vuejs.org/rules/v-bind-style.html#vue-v-bind-style
     */
    'vue/v-on-style': ['error', 'shorthand'],
    /**
     * vue 스크립트 셋업만 허용
     * https://eslint.vuejs.org/rules/component-api-style.html#vue-component-api-style
     */
    'vue/component-api-style': ['error', ['script-setup']],
    /**
     * Template, Script, Style 태그 사이에 1칸 띄어쓰기 적용
     * https://eslint.vuejs.org/rules/padding-line-between-blocks.html#vue-padding-line-between-blocks
     */
    'vue/padding-line-between-blocks': ['error'],
    /**
     * 템플릿 태그 프로퍼티 줄바꿈 검사 (prettier 충돌로 인해 off 처리)
     * https://eslint.vuejs.org/rules/first-attribute-linebreak.html#vue-first-attribute-linebreak
     */
    'vue/first-attribute-linebreak': 'off',
    /**
     * 탬플릿 태그 프로퍼티 2개 이상일 경우 줄바꿈 검사
     * https://eslint.vuejs.org/rules/max-attributes-per-line.html#vue-max-attributes-per-line
     */
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: { max: 1 },
        multiline: { max: 1 },
      },
    ],
    /**
     * 최소 한개 이상의 이벤트를 적용했는지 검사 (ex - @click + @keydown)
     * https://vue-a11y.github.io/eslint-plugin-vuejs-accessibility/rules/click-events-have-key-events.html
     */
    'vuejs-accessibility/click-events-have-key-events': 'off',
  },
  overrides: [
    {
      files: ['src/**/*.vue'],
      rules: {
        /**
         * 네이밍 컨벤션 룰 검사
         * https://typescript-eslint.io/rules/naming-convention/
         */
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: ['variable', 'function'],
            format: ['camelCase'],
          },
        ],
      },
    },
  ],
};
