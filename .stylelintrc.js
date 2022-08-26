const sortOrderSmacss = require('stylelint-config-property-sort-order-smacss/generate')

module.exports = {
  root: true,
  extends: 'stylelint-config-recommended-vue',
  plugins: ['stylelint-order'],
  overrides: [
    {
      files: ["**/*.css"],
      customSyntax: "postcss-scss",
    },
    {
      files: ["*.vue", "**/*.vue"],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    'order/properties-order': [sortOrderSmacss()],
    // 'max-line-length': 150,
  },
}
