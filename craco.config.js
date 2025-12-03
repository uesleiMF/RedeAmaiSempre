const path = require('path');

module.exports = {
  babel: {
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-private-methods'
    ]
  },
  webpack: {
    configure: (webpackConfig) => {
      // Forçar transpilar fast-png
      const jsRule = webpackConfig.module.rules.find(
        (rule) => rule.oneOf
      ).oneOf.find(
        (rule) => rule.test && rule.test.toString().includes('js|mjs|jsx|ts|tsx')
      );

      if (jsRule) {
        jsRule.include = [
          path.resolve('src'),
          path.resolve('node_modules/fast-png')
        ];
      }

      return webpackConfig;
    }
  }
};
