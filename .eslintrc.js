module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ["airbnb-base"],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  rules: {
    quotes: ["error", "double"],
    "comma-dangle": 0,
    "object-curly-newline": 0,
    "operator-linebreak": 0,
    // "implicit-arrow-linebreak": ["always"],
  },
  globals: {
    throwError: true,
    sendError: true,
    sendResponse: true,
    sendResponseText: true,
    sendResponseImage: true,
  },
};
