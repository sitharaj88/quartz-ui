/**
 * Babel config for tests + Metro consumers. Required so `babel-preset-expo`
 * (and its TypeScript handling) is found regardless of the cwd Jest is invoked
 * from. Library builds use tsup, not babel — this file only matters in test.
 */
module.exports = function babel(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
