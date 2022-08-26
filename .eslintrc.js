module.exports = {
  root: true,
  env: {
    node: true
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 0,
    'vue/no-mutating-props': 0,
  },

  extends: ['./.eslintrc-auto-import.json','plugin:vue/vue3-essential', 'eslint:recommended', 'eslint-config-prettier']
}
