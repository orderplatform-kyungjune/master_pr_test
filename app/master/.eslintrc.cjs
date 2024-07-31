module.exports = {
  root: false,
  env: {
    node: true,
    'vue/setup-compiler-macros': true,
  },
  plugins: ['cypress'],
  extends: [
    'plugin:tailwindcss/recommended',
    'plugin:cypress/recommended'
  ],
  rules: {
    'tailwindcss/no-custom-classname': 'off',
  },
};